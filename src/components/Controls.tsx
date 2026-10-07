import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { color, font, layout, radius, text } from '../theme';
import { Icon, IconName } from './Icon';

/* ------------------------------------------------------------------ */
/* Button — 52px tall, 14px radius, exactly as the Primary button node */
/* ------------------------------------------------------------------ */

type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** Orange CTA (#F28C28) or the inverted white-on-blue treatment. */
  variant?: 'accent' | 'surface' | 'brand';
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'accent',
  disabled,
  style,
}: ButtonProps) {
  const tone =
    variant === 'accent'
      ? { bg: color.accent, fg: color.surface }
      : variant === 'surface'
        ? { bg: color.surface, fg: color.brand }
        : { bg: color.brand, fg: color.surface };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: tone.bg },
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <Text style={[styles.buttonLabel, { color: tone.fg }]}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Field — 52px, 14px radius, 1px stroke, leading 18px icon            */
/* ------------------------------------------------------------------ */

type FieldProps = TextInputProps & {
  icon: IconName;
  /** Used for the placeholder colour/opacity pairing in the prototype. */
  placeholderOpacity?: number;
  tint?: string;
  containerStyle?: ViewStyle;
};

export function Field({
  icon,
  placeholder,
  placeholderOpacity = 0.62,
  tint = color.brand,
  containerStyle,
  ...rest
}: FieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Icon name={icon} size={layout.iconMd} color={tint} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={hexToRgba(tint, placeholderOpacity)}
        style={[styles.input, { color: tint }]}
        cursorColor={tint}
        {...rest}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Circular icon button — 28px header actions, 40/42px quick actions   */
/* ------------------------------------------------------------------ */

export function CircleButton({
  name,
  size = 28,
  iconSize = layout.iconLg,
  background,
  tint = color.brand,
  onPress,
  style,
}: {
  name: IconName;
  size?: number;
  iconSize?: number;
  background?: string;
  tint?: string;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={({ pressed }) => [
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background ?? 'transparent',
        },
        pressed && styles.circlePressed,
        style,
      ]}
    >
      <Icon name={name} size={iconSize} color={tint} />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox / Switch primitives used by Order + Address                */
/* ------------------------------------------------------------------ */

export function CheckCircle({ checked, size = 20 }: { checked: boolean; size?: number }) {
  return checked ? (
    <View style={[styles.checkOn, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name="check" size={size * 0.6} color={color.surface} />
    </View>
  ) : (
    <View style={[styles.checkOff, { width: size, height: size, borderRadius: 6 }]} />
  );
}

export function Toggle({
  value,
  onChange,
  size = 24,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  size?: number;
}) {
  const width = size + (size / 24) * 20; // 44px at the prototype's 24px thumb
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={[
        styles.toggle,
        { width, height: size, borderRadius: width / 2, backgroundColor: value ? color.brand : color.muted },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            width: (size / 24) * 18,
            height: (size / 24) * 18,
            borderRadius: size,
            transform: [{ translateX: value ? width - size - (size / 24) * 6 : (size / 24) * 3 }],
          },
        ]}
      />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Quantity stepper — #F4F7FB pill, 34px tall, 24px orange plus         */
/* ------------------------------------------------------------------ */

export function Stepper({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Icon name="minus" size={14} color={color.brand} />
      </Pressable>
      <Text style={styles.stepperValue}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={styles.stepperPlus}
      >
        <Icon name="plus" size={13} color={color.surface} />
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export { hexToRgba };

/* ------------------------------------------------------------------ */
/* Destructive confirmation                                            */
/* ------------------------------------------------------------------ */

/**
 * Two-button destructive prompt that actually works on every target.
 *
 * react-native-web ships `Alert` as an empty stub (`static alert() {}`), so a
 * plain `Alert.alert(...)` silently does nothing on web and leaves the button
 * looking broken. Web therefore falls back to the host's own confirm dialog;
 * native keeps the OS-styled Cancel / Delete pair.
 */
export function confirmDestructive({
  title,
  message,
  confirmLabel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  if (Platform.OS === 'web') {
    const host = globalThis as { confirm?: (text: string) => boolean };
    if (typeof host.confirm === 'function' && host.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

const styles = StyleSheet.create({
  button: {
    height: layout.controlHeight,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: {
    ...text.body,
    fontFamily: font.regular,
  },
  field: {
    height: layout.controlHeight,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.muted,
    backgroundColor: color.canvas,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  input: {
    flex: 1,
    ...text.label,
    padding: 0,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePressed: { opacity: 0.6 },
  checkOn: {
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOff: {
    borderWidth: 1.5,
    borderColor: color.muted,
  },
  toggle: {
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: color.surface,
  },
  stepper: {
    height: 34,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: color.canvas,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperValue: {
    ...text.metaSoft,
    color: color.brand,
  },
  stepperPlus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
