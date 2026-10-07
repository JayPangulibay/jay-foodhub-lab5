import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { color, font, radius, shadow, text } from '../theme';
import { Screen } from '../components/Screen';
import { Button, Field } from '../components/Controls';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';

/**
 * Screen 1 — "Splash / Login"
 * Blue canvas, 76px logo tile, two 52px fields, white CTA, three social buttons.
 */
export function LoginScreen() {
  const { dispatch } = useApp();
  const { width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // The design is authored at 428pt. Scale down proportionally on narrower phones.
  const scale = Math.min(1, width / 428);
  const px = (v: number) => Math.round(v * scale);

  function submit() {
    dispatch({ type: 'address', patch: { name } });
    dispatch({ type: 'signIn' });
    dispatch({ type: 'navigate', route: { name: 'home' } });
  }

  return (
    <Screen background={color.brand} withStatusBar statusTint={color.surface}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.body,
            {
              paddingTop: px(44),
              paddingBottom: px(34),
              paddingHorizontal: px(38),
              gap: px(20),
            },
          ]}
        >
          {/* Brand block */}
          <View style={styles.brand}>
            <View
              style={[
                styles.logo,
                {
                  width: px(76),
                  height: px(76),
                  borderRadius: px(24),
                  borderWidth: Math.max(1, px(2)),
                },
              ]}
            >
              <Icon name="shopping-bag" size={px(42)} color={color.surface} />
              <View style={styles.utensils}>
                <Icon name="utensils" size={px(20)} color={color.surface} />
              </View>
            </View>
            <Text
              style={[
                text.brandMark,
                { color: color.surface, fontSize: px(30), lineHeight: px(37) },
              ]}
            >
              Jay FoodHub
            </Text>
            <Text
              style={[
                text.label,
                { color: color.surface, opacity: 0.86, fontSize: px(13) },
              ]}
            >
              Good Food, Right to Your Doorstep.
            </Text>
          </View>

          {/* Fields sit on the blue so they invert: transparent fill, white stroke. */}
          <View style={[styles.form, { gap: px(12) }]}>
            <Field
              icon="user"
              placeholder="Name"
              value={name}
              onChangeText={setName}
              tint={color.surface}
              placeholderOpacity={0.88}
              containerStyle={styles.onBrand}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
            <Field
              icon="lock"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              tint={color.surface}
              placeholderOpacity={0.88}
              containerStyle={styles.onBrand}
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
            />
            <Pressable
              accessibilityRole="button"
              hitSlop={10}
              style={styles.help}
            >
              <Text style={[text.link, { color: color.surface, fontSize: px(11) }]}>
                Forgot Password?
              </Text>
            </Pressable>
            <Button
              label="Login"
              variant="surface"
              onPress={submit}
              style={{ height: px(52), borderRadius: px(14) }}
            />
          </View>

          {/* Social row */}
          <View style={[styles.social, { gap: px(12) }]}>
            <Text
              style={[
                text.link,
                { color: color.surface, opacity: 0.82, fontSize: px(11) },
              ]}
            >
              Or continue with
            </Text>
            <View style={[styles.socialRow, { gap: px(14) }]}>
              <SocialButton name="facebook" />
              <SocialButton name="twitter" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
                style={({ pressed }) => [
                  styles.socialCircle,
                  { width: px(42), height: px(42), opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[text.bodyStrong, { color: color.brand, fontSize: px(14) }]}>
                  G+
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={[text.label, { color: color.surface, fontSize: px(13) }]}>
            Don’t have an account?{' '}
            <Text style={{ color: color.surface, fontFamily: font.regular }}>Sign up now.</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function SocialButton({ name }: { name: 'facebook' | 'twitter' }) {
  const { width } = useWindowDimensions();
  const scale = Math.min(1, width / 428);
  const px = (v: number) => Math.round(v * scale);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${name}`}
      style={({ pressed }) => [
        styles.socialCircle,
        { width: px(42), height: px(42), opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Icon name={name} size={px(18)} color={color.brand} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    borderColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  utensils: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  form: {
    width: '100%',
  },
  onBrand: {
    backgroundColor: 'transparent',
    borderColor: color.surface,
  },
  help: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
  },
  social: {
    width: '100%',
    alignItems: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialCircle: {
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
