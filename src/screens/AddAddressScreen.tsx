import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { color, font, text } from '../theme';
import { Screen } from '../components/Screen';
import { BlueHeader } from '../components/Chrome';
import { Button, Field, Toggle } from '../components/Controls';
import { Icon, IconName } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp, useBack, useNavigate, type StateAddress } from '../state/AppContext';
import { STATIONS } from '../data/menu';
import { addAddressDB } from '../services/db';

/** §8 — the four delivery fields, in prototype order, plus the two the
 *  addresses table requires (LABORATORY 5 asks for street + city validation).
 *  Both reuse the existing Field control, so no dimension or colour is new. */
const FIELDS: {
  key: keyof StateAddress;
  icon: IconName;
  placeholder: string;
  keyboard: KeyboardTypeOptions;
}[] = [
  { key: 'street', icon: 'house', placeholder: 'Street', keyboard: 'default' },
  { key: 'city', icon: 'map-pinned', placeholder: 'City', keyboard: 'default' },
  { key: 'phone', icon: 'phone', placeholder: 'Phone no', keyboard: 'phone-pad' },
  { key: 'estate', icon: 'map-pin', placeholder: 'Estate', keyboard: 'default' },
  { key: 'email', icon: 'mail', placeholder: 'email', keyboard: 'email-address' },
  { key: 'building', icon: 'building', placeholder: 'Industrial Area', keyboard: 'default' },
];

/** Fields whose value is a proper noun. */
const TITLE_CASE_KEYS: (keyof StateAddress)[] = ['street', 'city', 'estate', 'building'];

/**
 * Screen 5 — "Add Address"
 * Tall blue header, then a form spread with SPACE_BETWEEN so the Submit action
 * sits at the bottom of the viewport.
 */
export function AddAddressScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const back = useBack();
  const { px } = useScale();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickup = state.deliveryMode === 'station';

  /** Street and city are the two columns the addresses table cannot omit. */
  const submit = async () => {
    const street = state.address.street.trim();
    const city = state.address.city.trim();

    if (!street || !city) {
      setError('Street and city are required');
      return;
    }
    setError(null);

    try {
      await addAddressDB({
        street,
        city,
        station: state.station,
        mode: state.deliveryMode,
        isDefault: state.setAsDefault,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // Best effort — the form still proceeds if the write is unavailable.
      console.warn('[db] addAddress failed', e);
    }

    // Delivery mode decides where the order is headed.
    dispatch({ type: 'stage', value: 'Preparing' });
    navigate({ name: 'trackOrder' });
  };

  return (
    <Screen background={color.surface} withStatusBar={false}>
      <BlueHeader
        title="Add Address"
        leading="chevron-left"
        onLeading={back}
        trailing="more-horizontal"
        bottomOffset={18}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.form,
            { padding: px(26), paddingBottom: px(26) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: px(18) }}>
            {/* Introduction */}
            <View style={{ gap: px(7) }}>
              <Text style={[text.display, { color: color.brand, fontSize: px(22), lineHeight: px(27) }]}>
                Delivery details
              </Text>
              <Text style={[styles.formIntro, { fontSize: px(12), lineHeight: px(15) }]}>
                Please fill in your delivery information
              </Text>
            </View>

            {/* Fields */}
            <View style={{ gap: px(11) }}>
              {FIELDS.map((f) => (
                <Field
                  key={f.key}
                  icon={f.icon}
                  placeholder={f.placeholder}
                  placeholderOpacity={0.62}
                  value={state.address[f.key]}
                  onChangeText={(v) => {
                    if (error) setError(null);
                    dispatch({ type: 'address', patch: { [f.key]: v } });
                  }}
                  keyboardType={f.keyboard}
                  autoCapitalize={TITLE_CASE_KEYS.includes(f.key) ? 'words' : 'none'}
                />
              ))}

              {error ? (
                <Text style={[styles.formError, { fontSize: px(12), lineHeight: px(15) }]}>
                  {error}
                </Text>
              ) : null}
            </View>

            {/* Delivery mode — segmented control, active segment filled. */}
            <View style={[styles.segmented, { gap: px(10) }]}>
              <Segment
                label="Pickup station"
                active={pickup}
                onPress={() => dispatch({ type: 'deliveryMode', value: 'station' })}
              />
              <Segment
                label="Doorstep delivery"
                active={!pickup}
                onPress={() => dispatch({ type: 'deliveryMode', value: 'doorstep' })}
              />
            </View>

            {/* Station dropdown, only meaningful for pickup. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Choose your station, currently ${
                state.station ?? 'none selected'
              }`}
              accessibilityState={{ expanded: open }}
              disabled={!pickup}
              onPress={() => setOpen((v) => !v)}
              style={({ pressed }) => [
                styles.dropdown,
                {
                  height: px(52),
                  borderRadius: px(14),
                  paddingHorizontal: px(16),
                  opacity: !pickup ? 0.45 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.dropdownLeft}>
                <Icon name="map-pinned" size={px(18)} color={color.brand} />
                <Text style={[styles.dropdownText, { fontSize: px(12), lineHeight: px(15) }]}>
                  {state.station ?? 'Choose Your Station'}
                </Text>
              </View>
              <Icon name={open ? 'chevron-up' : 'chevron-down'} size={px(18)} color={color.brand} />
            </Pressable>

            {open && pickup ? (
              <View style={[styles.menu, { borderRadius: px(14) }]}>
                {STATIONS.map((station) => {
                  const on = state.station === station;
                  return (
                    <Pressable
                      key={station}
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected: on }}
                      onPress={() => {
                        dispatch({ type: 'station', value: station });
                        setOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.menuItem,
                        { height: px(44), opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.menuItemText,
                          {
                            color: on ? color.accent : color.brand,
                            fontSize: px(12),
                            lineHeight: px(15),
                          },
                        ]}
                      >
                        {station}
                      </Text>
                      {on ? <Icon name="check" size={px(14)} color={color.accent} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {/* Default address */}
            <View style={[styles.defaultRow, { height: px(32) }]}>
              <View style={[styles.defaultCopy, { gap: px(4) }]}>
                <Text style={[styles.defaultTitle, { fontSize: px(13), lineHeight: px(16) }]}>
                  Set as default address
                </Text>
                <Text style={[styles.defaultDetail, { fontSize: px(10), lineHeight: px(12) }]}>
                  Use this address for your next order
                </Text>
              </View>
              <Toggle
                value={state.setAsDefault}
                onChange={(v) => dispatch({ type: 'defaultAddress', value: v })}
              />
            </View>
          </View>

          <View style={[styles.submit, { paddingTop: px(26) }]}>
            <Button label="Submit" onPress={submit} style={{ height: px(52), borderRadius: px(14) }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Segment({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { px } = useScale();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.segment,
        {
          flex: 1,
          height: px(48),
          borderRadius: px(14),
          backgroundColor: active ? color.brand : 'transparent',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.segmentText,
          { color: active ? color.surface : color.brand, fontSize: px(11), lineHeight: px(13) },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { flexGrow: 1, justifyContent: 'space-between' },
  formIntro: { fontFamily: font.regular, color: color.brand, opacity: 0.58 },
  formError: { fontFamily: font.medium, color: color.accent },
  segmented: { flexDirection: 'row' },
  segment: { alignItems: 'center', justifyContent: 'center' },
  segmentText: { fontFamily: font.bold },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.canvas,
  },
  dropdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  dropdownText: { fontFamily: font.medium, color: color.brand, opacity: 0.7 },
  menu: {
    backgroundColor: color.canvas,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  menuItemText: { fontFamily: font.regular },
  defaultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  defaultCopy: { justifyContent: 'center' },
  defaultTitle: { fontFamily: font.bold, color: color.brand },
  defaultDetail: { fontFamily: font.regular, color: color.brand, opacity: 0.5 },
  submit: {},
});
