import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, shadow, text } from '../theme';
import { Screen } from '../components/Screen';
import { PageHeader } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp, useBack } from '../state/AppContext';
import { COURIER, STAGES, assets } from '../data/menu';

/**
 * Screen 4 — "Track Order"
 * A 404px decorative map (white roads over blue-grey blocks, two pins and a
 * dashed route) above the courier card and the four-step progress tracker.
 */
export function TrackOrderScreen() {
  const { state, dispatch } = useApp();
  const back = useBack();
  const { px } = useScale();

  const reached = STAGES.indexOf(state.stage);
  const completedShare = reached >= STAGES.length - 1 ? 1 : reached / (STAGES.length - 1);

  return (
    <Screen background={color.surface} withStatusBar={false}>
      {/* Map */}
      <View style={[styles.map, { height: px(404) }]}>
        <MapArt px={px} />
        <View style={styles.mapHeader}>
          <PageHeader title="Track Order" leading="arrow-left" onLeading={back} />
        </View>

        {/* Arrival card floats over the map. */}
        <View style={[styles.arrival, { height: px(88), borderRadius: px(18), paddingHorizontal: px(16), bottom: px(16) }]}>
          <View style={[styles.arrivalCopy, { gap: px(5) }]}>
            <Text style={[styles.arrivalTitle, { fontSize: px(15), lineHeight: px(18) }]}>
              {COURIER.headline}
            </Text>
            <Text style={[styles.arrivalEta, { fontSize: px(12), lineHeight: px(15) }]}>
              {COURIER.eta}
            </Text>
          </View>
          <View style={[styles.arrivalBadge, { width: px(46), height: px(46) }]}>
            <Icon name="clock" size={px(21)} color={color.brand} />
          </View>
        </View>
      </View>

      {/* Tracking details */}
      <View style={[styles.details, { padding: px(20), gap: px(22) }]}>
        {/* Courier */}
        <View style={[styles.courier, { borderRadius: px(18), padding: px(14), gap: px(12) }]}>
          <Image
            source={assets.courier}
            style={{ width: px(58), height: px(58), borderRadius: px(29) }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={[styles.courierCopy, { gap: px(4) }]}>
            <Text style={[styles.courierName, { fontSize: px(15), lineHeight: px(18) }]}>
              {COURIER.name}
            </Text>
            <Text style={[styles.courierRole, { fontSize: px(10), lineHeight: px(12) }]}>
              {COURIER.role}
            </Text>
            <View style={styles.rating}>
              <Icon name="star" size={px(15)} color={color.accent} filled />
              <Text style={[styles.ratingText, { fontSize: px(11), lineHeight: px(13) }]}>
                {COURIER.rating}
              </Text>
            </View>
          </View>
          <View style={[styles.courierActions, { gap: px(8) }]}>
            <QuickAction name="phone" label="Call courier" />
            <QuickAction name="message-circle" label="Message courier" />
          </View>
        </View>

        {/* Progress */}
        <View style={{ gap: px(16) }}>
          <Text style={[text.itemName, { color: color.brand, fontSize: px(17), lineHeight: px(21) }]}>
            Order progress
          </Text>

          <View style={{ gap: px(9) }}>
            {/* Track sits behind the markers; the accent portion spans completed steps. */}
            <View style={[styles.track, { height: px(3), marginHorizontal: px(37) }]}>
              <View
                style={[
                  styles.trackDone,
                  {
                    height: px(3),
                    width: `${completedShare * 100}%`,
                    borderRadius: px(2),
                  },
                ]}
              />
            </View>

            <View style={styles.steps}>
              {STAGES.map((stage, index) => {
                const done = index <= reached;
                return (
                  <Pressable
                    key={stage}
                    accessibilityRole="button"
                    accessibilityLabel={`${stage}, ${done ? 'complete' : 'pending'}`}
                    onPress={() => dispatch({ type: 'stage', value: stage })}
                    style={[styles.step, { gap: px(9) }]}
                  >
                    <View
                      style={[
                        styles.marker,
                        {
                          width: px(30),
                          height: px(30),
                          borderRadius: px(15),
                          backgroundColor: done ? color.accent : color.muted,
                        },
                      ]}
                    >
                      {done ? (
                        <Icon name="check" size={px(15)} color={color.surface} />
                      ) : (
                        <View style={{ width: px(8), height: px(8), borderRadius: px(4), backgroundColor: color.brand, opacity: 0.4 }} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        {
                          fontSize: px(10),
                          lineHeight: px(12),
                          fontFamily: done ? font.bold : font.medium,
                          opacity: done ? 1 : 0.5,
                        },
                      ]}
                    >
                      {stage}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

function QuickAction({ name, label }: { name: 'phone' | 'message-circle'; label: string }) {
  const { px } = useScale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => Linking.openURL(`tel:`)}
      style={({ pressed }) => [
        styles.quickAction,
        {
          width: px(42),
          height: px(42),
          borderRadius: px(21),
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Icon name={name} size={px(18)} color={color.brand} />
    </Pressable>
  );
}

/**
 * The prototype draws the map as rotated rounded roads plus grey blocks. The
 * roads are laid out with absolute positioning and rotation to match.
 */
function MapArt({ px }: { px: (v: number) => number }) {
  const road = (w: number, h: number, deg: number, key: string) => (
    <View
      key={key}
      style={{
        position: 'absolute',
        width: px(w),
        height: px(h),
        borderRadius: px(999),
        backgroundColor: color.surface,
        transform: [{ rotate: `${deg}deg` }],
      }}
    />
  );

  const block = (w: number, h: number, top: number, left: number, key: string) => (
    <View
      key={key}
      style={{
        position: 'absolute',
        top: px(top),
        left: px(left),
        width: px(w),
        height: px(h),
        borderRadius: px(10),
        backgroundColor: color.muted,
      }}
    />
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.mapBase, { height: px(404) }]} />
      {road(478, 85, -8, 'r1')}
      {road(404, 99, 12, 'r2')}
      {road(74, 418, 8, 'r3')}
      {road(88, 355, -12, 'r4')}
      {block(88, 58, 74, 44, 'b1')}
      {block(62, 48, 168, 300, 'b2')}
      {block(70, 56, 250, 96, 'b3')}
      {block(72, 48, 96, 268, 'b4')}

      {/* Dashed route from store to destination. */}
      <View
        style={[
          styles.route,
          { width: px(276), height: px(172), top: px(128), left: px(76) },
        ]}
      />

      <View style={[styles.pin, { top: px(150), left: px(112), width: px(42), height: px(42) }]}>
        <Icon name="store" size={px(20)} color={color.surface} />
      </View>
      <View style={[styles.pin, { top: px(258), left: px(292), width: px(44), height: px(44), backgroundColor: color.accent }]}>
        <Icon name="home" size={px(20)} color={color.surface} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { backgroundColor: color.canvas, overflow: 'hidden' },
  mapBase: { width: '100%', backgroundColor: color.canvas },
  mapHeader: { position: 'absolute', top: 0, left: 0, right: 0 },
  route: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: color.brand,
    borderStyle: 'dashed',
    borderRadius: 999,
    opacity: 0.55,
    transform: [{ rotate: '-12deg' }],
  },
  pin: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrival: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.surface,
    ...shadow.card,
  },
  arrivalCopy: { justifyContent: 'center' },
  arrivalTitle: { fontFamily: font.regular, color: color.brand },
  arrivalEta: { fontFamily: font.medium, color: color.brand, opacity: 0.6 },
  arrivalBadge: {
    borderRadius: radius.pill,
    backgroundColor: color.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: { flex: 1, backgroundColor: color.surface },
  courier: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surface,
  },
  courierCopy: { flex: 1, justifyContent: 'center' },
  courierName: { fontFamily: font.regular, color: color.brand },
  courierRole: { fontFamily: font.regular, color: color.brand, opacity: 0.55 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: font.bold, color: color.brand },
  courierActions: { flexDirection: 'row' },
  quickAction: {
    backgroundColor: color.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { backgroundColor: color.muted },
  trackDone: { backgroundColor: color.accent },
  steps: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { width: 76, alignItems: 'center' },
  marker: { alignItems: 'center', justifyContent: 'center' },
  stepLabel: { color: color.brand, textAlign: 'center' },
});
