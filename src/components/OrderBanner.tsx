import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, shadow, text } from '../theme';
import { Icon } from './Icon';
import { useScale } from './scale';
import { useApp } from '../state/AppContext';

const VISIBLE_MS = 4000;
const IN_MS = 240;
const OUT_MS = 200;

/**
 * The simple order alert: a drop-down banner pinned above the page header.
 * No push infrastructure, no permission prompt — just a styled toast.
 *
 * The banner owns only the animation — state lives in the context. Dismissing
 * animates out *first* and clears context state from the completion callback,
 * which keeps the element mounted for the fade and avoids a `setState` in the
 * effect body.
 */
export function OrderBanner() {
  const { state, dispatch } = useApp();
  const { px } = useScale();
  const [progress] = useState(() => new Animated.Value(0));
  const banner = state.banner;

  const dismiss = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: OUT_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) dispatch({ type: 'banner', banner: null });
    });
  }, [dispatch, progress]);

  useEffect(() => {
    if (!banner) return;

    Animated.timing(progress, {
      toValue: 1,
      duration: IN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [banner, dismiss, progress]);

  if (!banner) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          paddingHorizontal: px(20),
          paddingTop: px(56),
          opacity: progress,
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) },
          ],
        },
      ]}
    >
      <Pressable
        onPress={dismiss}
        accessibilityRole="alert"
        accessibilityLabel={`${banner.title}. ${banner.detail}. Dismiss`}
        style={({ pressed }) => [
          styles.card,
          {
            borderRadius: px(radius.panel),
            padding: px(14),
            gap: px(12),
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.badge, { width: px(34), height: px(34), borderRadius: px(17) }]}>
          <Icon name="bell" size={px(17)} color={color.brand} />
        </View>

        <View style={styles.copy}>
          <Text style={[styles.title, { fontSize: px(14), lineHeight: px(17) }]}>
            {banner.title}
          </Text>
          <Text style={[styles.detail, { fontSize: px(12), lineHeight: px(15) }]}>
            {banner.detail}
          </Text>
        </View>

        <Icon name="x" size={px(16)} color={color.surface} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  card: {
    backgroundColor: color.brand,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.card,
  },
  badge: {
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { ...text.body, fontFamily: font.semiBold, color: color.surface },
  detail: { ...text.metaSoft, color: color.surface, opacity: 0.75 },
});
