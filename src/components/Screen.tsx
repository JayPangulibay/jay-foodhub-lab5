import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { color, layout, radius, shadow } from '../theme';
import { StatusBar } from './StatusBar';

type Props = {
  children: React.ReactNode;
  /** Screen background. Defaults to white, matching fill_658ab2fa. */
  background?: string;
  /** Set false on screens that draw their own header inside the map/hero. */
  withStatusBar?: boolean;
  statusTint?: string;
  contentStyle?: ViewStyle;
  scroll?: boolean;
};

/**
 * The 428×926 device frame from the prototype, expressed as a flex column so
 * it fills any device while keeping every internal measurement intact.
 */
export function Screen({
  children,
  background = color.surface,
  withStatusBar = true,
  statusTint,
  contentStyle,
  scroll = false,
}: Props) {
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      {withStatusBar && <StatusBar tint={statusTint} />}
      {body}
    </View>
  );
}

/** Wraps content in the presentation-style rounded card when previewed on the artboard. */
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return <View style={styles.frame}>{children}</View>;
}

/** Section heading row used by "Popular Menu" and "Your order". */
export function SectionRow({
  title,
  action,
  style,
}: {
  title: string;
  action?: string;
  style?: TextStyle;
}) {
  return (
    <View style={styles.sectionRow}>
      <Label style={style}>{title}</Label>
      {action ? <ActionLabel>{action}</ActionLabel> : null}
    </View>
  );
}

import { Text } from 'react-native';
import { text } from '../theme';

export function Label({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[text.title, style]}>{children}</Text>;
}

export function ActionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.action}>{children}</Text>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 12 },
  frame: {
    width: layout.screenWidth,
    height: layout.screenHeight,
    borderRadius: radius.screen,
    overflow: 'hidden',
    backgroundColor: color.surface,
    ...shadow.screen,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    ...text.strong,
    color: color.brand,
  },
});
