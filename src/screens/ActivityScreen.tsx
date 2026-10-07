import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, text } from '../theme';
import { Screen } from '../components/Screen';
import { BlueHeader, BottomNav } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp } from '../state/AppContext';
import { ACTIVITY, ACTIVITY_FILTERS, type ActivityFilter } from '../data/menu';

/**
 * Screen 6 — "Activity"
 * Blue header, four filter chips, then a vertical timeline whose spine runs the
 * full height behind 82px events. The delivered event carries the accent fill.
 */
export function ActivityScreen() {
  const { state, dispatch } = useApp();
  const { px } = useScale();

  const events =
    state.activityFilter === 'all'
      ? ACTIVITY
      : ACTIVITY.filter((e) => e.filter === state.activityFilter);

  return (
    <Screen background={color.surface} withStatusBar={false}>
      <BlueHeader title="Activity" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: px(18),
            paddingBottom: px(8),
            paddingHorizontal: px(20),
            gap: px(16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filters}>
          {ACTIVITY_FILTERS.map((chip) => {
            const on = state.activityFilter === chip.key;
            return (
              <Pressable
                key={chip.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={chip.label}
                onPress={() =>
                  dispatch({ type: 'activityFilter', value: chip.key as ActivityFilter })
                }
                style={({ pressed }) => [
                  styles.chip,
                  {
                    width: px(chip.width),
                    height: px(34),
                    borderRadius: px(17),
                    paddingHorizontal: px(16),
                    backgroundColor: on ? color.accent : color.muted,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: on ? color.surface : color.brand,
                      fontSize: px(11),
                      lineHeight: px(13),
                    },
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {events.length > 1 ? (
            <View
              pointerEvents="none"
              style={[styles.spine, { top: px(38), height: px(events.length * 82 - 44), width: px(2) }]}
            />
          ) : null}

          {events.map((event) => (
            <View key={event.id} style={[styles.event, { height: px(82), gap: px(12) }]}>
              <View
                style={[
                  styles.marker,
                  {
                    width: px(38),
                    height: px(38),
                    borderRadius: px(19),
                    backgroundColor: event.tone === 'accent' ? color.accent : color.muted,
                  },
                ]}
              >
                <Icon
                  name={event.icon}
                  size={px(17)}
                  color={event.tone === 'accent' ? color.surface : color.brand}
                />
              </View>

              <View style={[styles.eventCopy, { gap: px(4), paddingTop: px(1) }]}>
                <Text numberOfLines={1} style={[styles.eventTitle, { fontSize: px(13), lineHeight: px(16) }]}>
                  {event.title}
                </Text>
                <Text numberOfLines={2} style={[styles.eventDetail, { fontSize: px(10), lineHeight: px(14) }]}>
                  {event.detail}
                </Text>
                <Text style={[styles.eventTime, { fontSize: px(9), lineHeight: px(11) }]}>
                  {event.time}
                </Text>
              </View>
            </View>
          ))}

          {events.length === 0 ? (
            <Text style={[styles.empty, { fontSize: px(13) }]}>Nothing here yet.</Text>
          ) : null}
        </View>
      </ScrollView>

      <BottomNav active="activity" onSelect={(key) => dispatch({ type: 'tab', tab: key })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  filters: { flexDirection: 'row', justifyContent: 'space-between' },
  chip: { alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: font.regular },
  timeline: { position: 'relative' },
  spine: {
    position: 'absolute',
    left: 18,
    backgroundColor: color.muted,
  },
  event: { flexDirection: 'row' },
  marker: { alignItems: 'center', justifyContent: 'center' },
  eventCopy: { flex: 1, justifyContent: 'flex-start' },
  eventTitle: { fontFamily: font.regular, color: color.brand },
  eventDetail: { fontFamily: font.regular, color: color.brand, opacity: 0.62 },
  eventTime: { fontFamily: font.regular, color: color.brand, opacity: 0.4 },
  empty: { fontFamily: font.regular, color: color.brand, opacity: 0.5, textAlign: 'center' },
});
