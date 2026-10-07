import { useWindowDimensions } from 'react-native';
import { layout } from '../theme';

/**
 * The prototype is authored at 428pt wide. Rather than hardcoding that, screens
 * scale their measurements proportionally so the layout holds on narrower
 * phones and tablets without a second set of styles.
 */
export function useScale() {
  const { width } = useWindowDimensions();
  const factor = Math.min(1, width / layout.screenWidth);
  return {
    factor,
    /** Scale a design measurement to the current device width. */
    px: (value: number) => Math.round(value * factor),
  };
}
