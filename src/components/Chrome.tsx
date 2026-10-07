import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, layout, radius, text } from '../theme';
import { Icon, IconName } from './Icon';
import { useScale } from './scale';
import { useBack } from '../state/AppContext';

/**
 * §3 — the 428×54 page header. Leading and trailing slots are 28×28; the
 * prototype uses a same-size spacer when a side has no glyph, which keeps the
 * title optically centred.
 */
export function PageHeader({
  title,
  leading,
  trailing,
  onLeading,
  onTrailing,
  tint = color.brand,
}: {
  title: string;
  leading?: IconName;
  trailing?: IconName;
  onLeading?: () => void;
  onTrailing?: () => void;
  tint?: string;
}) {
  const { px } = useScale();

  const slot = (name?: IconName, onPress?: () => void, label?: string) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [
        { width: px(28), height: px(28), alignItems: 'center', justifyContent: 'center' },
        pressed && onPress ? { opacity: 0.6 } : null,
      ]}
    >
      {name ? <Icon name={name} size={px(21)} color={tint} /> : null}
    </Pressable>
  );

  return (
    <View style={styles.header}>
      {slot(leading, onLeading, leading ? title : undefined)}
      <Text
        numberOfLines={1}
        style={[text.title, { color: tint, fontSize: px(18), lineHeight: px(22) }]}
      >
        {title}
      </Text>
      {slot(trailing, onTrailing, trailing ? title : undefined)}
    </View>
  );
}

/**
 * §3 — the five 60px-wide tab items. Active adds the 18×3 indicator pill and
 * lifts the item from 37 to 45; inactive dims the icon and the label.
 */
const TABS: { key: 'home' | 'orders' | 'savings' | 'activity' | 'more'; icon: IconName; label: string }[] = [
  { key: 'home', icon: 'house', label: 'Home' },
  { key: 'orders', icon: 'receipt', label: 'Orders' },
  { key: 'savings', icon: 'badge-dollar', label: 'Savings' },
  { key: 'activity', icon: 'bell', label: 'Activity' },
  { key: 'more', icon: 'menu', label: 'More' },
];

export function BottomNav({
  active,
  onSelect,
}: {
  active: 'home' | 'orders' | 'savings' | 'activity' | 'more';
  onSelect: (key: 'home' | 'orders' | 'savings' | 'activity' | 'more') => void;
}) {
  const { px } = useScale();

  return (
    <View style={[styles.nav, { paddingHorizontal: px(18), paddingTop: px(11), paddingBottom: px(9) }]}>
      {TABS.map((tab) => {
        const on = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={tab.label}
            style={styles.navItem}
          >
            <Icon name={tab.icon} size={px(20)} color={color.brand} filled={false} />
            <Text
              numberOfLines={1}
              style={[
                styles.navLabel,
                {
                  fontSize: px(10),
                  lineHeight: px(12),
                  opacity: on ? 1 : 0.45,
                  fontFamily: on ? font.regular : font.medium,
                },
              ]}
            >
              {tab.label}
            </Text>
            {on ? <View style={[styles.navIndicator, { width: px(18), height: px(3) }]} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * §3 / §5 / §8 — the blue headers with `0 0 24 24` radii. Activity, Savings and
 * Add Address all share this construction: status bar, then page header.
 */
export function BlueHeader({
  title,
  leading,
  trailing,
  onLeading,
  onTrailing,
  bottomOffset = 0,
}: {
  title: string;
  leading?: IconName;
  trailing?: IconName;
  onLeading?: () => void;
  onTrailing?: () => void;
  /** Extra height below the header — Add Address stacks a taller block. */
  bottomOffset?: number;
}) {
  const { px } = useScale();
  return (
    <View
      style={[
        styles.blueHeader,
        {
          borderBottomLeftRadius: px(24),
          borderBottomRightRadius: px(24),
          paddingBottom: px(bottomOffset),
        },
      ]}
    >
      <PageHeader
        title={title}
        leading={leading}
        trailing={trailing}
        onLeading={onLeading}
        onTrailing={onTrailing}
        tint={color.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.surface,
  },
  navItem: {
    width: 60,
    alignItems: 'center',
  },
  navLabel: {
    color: color.brand,
    marginTop: 5,
  },
  navIndicator: {
    marginTop: 5,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
  },
  blueHeader: {
    backgroundColor: color.brand,
  },
});

/** Convenience wrapper so screens can spread a back button without importing state. */
export function useHeaderBack() {
  const back = useBack();
  return () => back();
}
