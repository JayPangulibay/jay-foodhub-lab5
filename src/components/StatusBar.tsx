import React, { useEffect, useState } from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';
import { color, font, layout, text } from '../theme';
import { Icon } from './Icon';

/**
 * Reproduces the 48px iOS status bar row present in every screen
 * (padding 13px 26px 0, "9:41" on the left, three glyphs on the right).
 * The bar hides itself once the real device notch has been accounted for
 * by the SafeAreaView, avoiding a double inset.
 */
export function StatusBar({ tint = color.brand }: { tint?: string }) {
  return (
    <View style={styles.root} pointerEvents="none">
      <Text style={[styles.time, { color: tint }]}>9:41</Text>
      <View style={styles.glyphs}>
        <Icon name="signal" size={layout.iconSm} color={tint} />
        <Icon name="wifi" size={layout.iconSm} color={tint} />
        <Icon name="battery" size={23} color={tint} />
      </View>
    </View>
  );
}

/** Pulsing "you're live" badge — small, unobtrusive, mirrors the prototype's calm tone. */
export function LivePulse({ label = 'Live' }: { label?: string }) {
  // Lazy initialiser keeps one Animated.Value for the component's lifetime
  // without reading a ref during render.
  const [pulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.pulseRow}>
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
      <Text style={styles.pulseText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: layout.statusBarHeight,
    paddingTop: 13,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    ...text.labelStrong,
    fontFamily: font.bold,
  },
  glyphs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.accent,
  },
  pulseText: {
    ...text.caption,
    color: color.brand,
    opacity: 0.55,
  },
});
