import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { color } from '../theme';

export type IconName =
  | 'signal'
  | 'wifi'
  | 'battery'
  | 'shopping-bag'
  | 'utensils'
  | 'user'
  | 'lock'
  | 'facebook'
  | 'twitter'
  | 'map-pin'
  | 'shopping-cart'
  | 'search'
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'house'
  | 'receipt'
  | 'badge-dollar'
  | 'bell'
  | 'menu'
  | 'star'
  | 'minus'
  | 'plus'
  | 'check'
  | 'store'
  | 'home'
  | 'clock'
  | 'phone'
  | 'message-circle'
  | 'mail'
  | 'building'
  | 'map-pinned'
  | 'more-horizontal'
  | 'trash'
  | 'x'
  /* --- Activity timeline --- */
  | 'bike'
  | 'badge-check'
  | 'badge-percent'
  /* --- Savings --- */
  | 'ticket-percent'
  | 'tags'
  | 'tag'
  | 'piggy-bank';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** Some glyphs in the prototype are filled outlines (e.g. the active star). */
  filled?: boolean;
};

/**
 * Hand-tuned vector equivalents of the Lucide set used in the Figma file.
 * Stroke width is normalised to 2 at a 24px grid, then scaled to `size`.
 */
export function Icon({ name, size = 20, color: tint = color.brand, filled = false }: Props) {
  const s = size / 24;
  const sw = 2 * s;

  const common = {
    stroke: tint,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {render(name, common, tint, filled)}
    </Svg>
  );
}

function render(name: IconName, p: any, tint: string, filled: boolean) {
  switch (name) {
    /* --- iOS status bar --- */
    case 'signal':
      return (
        <G>
          <Rect x={1} y={14} width={3} height={6} rx={1} fill={tint} />
          <Rect x={7} y={11} width={3} height={9} rx={1} fill={tint} />
          <Rect x={13} y={7} width={3} height={13} rx={1} fill={tint} />
          <Rect x={19} y={3} width={3} height={17} rx={1} fill={tint} />
        </G>
      );
    case 'wifi':
      return (
        <G {...p} fill="none">
          <Path d="M2 8.5a15 15 0 0 1 20 0" />
          <Path d="M5 12a10.5 10.5 0 0 1 14 0" />
          <Path d="M8.5 15.5a6 6 0 0 1 7 0" />
          <Circle cx={12} cy={19} r={1.1} fill={tint} stroke="none" />
        </G>
      );
    case 'battery':
      return (
        <G>
          <Rect
            x={1}
            y={7}
            width={20}
            height={11}
            rx={3.4}
            stroke={tint}
            strokeWidth={(p.strokeWidth ?? 2) * 0.75}
            fill="none"
          />
          <Rect x={3.2} y={9.2} width={15.6} height={6.6} rx={2} fill={tint} />
          <Path d="M23 11v3.4a2 2 0 0 0 0-3.4z" fill={tint} />
        </G>
      );

    /* --- Brand --- */
    case 'shopping-bag':
      return (
        <G {...p}>
          <Path d="M5.4 7.5 6.6 4a2 2 0 0 1 1.9-1.4h7a2 2 0 0 1 1.9 1.4l1.2 3.5" />
          <Path d="M4.6 7.5h14.8a1 1 0 0 1 1 1.1l-.8 11.3a2 2 0 0 1-2 1.9H6.4a2 2 0 0 1-2-1.9L3.6 8.6a1 1 0 0 1 1-1.1Z" />
          <Path d="M9 10.5a3 3 0 0 0 6 0" />
        </G>
      );
    case 'utensils':
      return (
        <G {...p}>
          <Path d="M7 3v7a2 2 0 0 1-2 2 2 2 0 0 1-2-2V3" />
          <Path d="M5 12v9" />
          <Path d="M17 3c-1.7 1-2.6 3-2.6 5.5 0 2 .8 3.2 2.6 3.5V21" />
        </G>
      );

    /* --- Auth --- */
    case 'user':
      return (
        <G {...p}>
          <Path d="M19 20.5v-1.8a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1.8" />
          <Circle cx={12} cy={7.5} r={3.8} />
        </G>
      );
    case 'lock':
      return (
        <G {...p}>
          <Rect x={4} y={10.5} width={16} height={10.5} rx={2.6} />
          <Path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
          <Path d="M12 14.6v2.6" />
        </G>
      );
    case 'facebook':
      return (
        <Path
          d="M14.5 8.5h2.2V5.6c-.4-.05-1.7-.16-3.2-.16-3.2 0-5.3 1.9-5.3 5.4v2.6H5.4v3.2h2.8V22h3.5v-5.4h2.7l.5-3.2h-3.2v-2.3c0-1 .3-1.6 1.8-1.6Z"
          fill={tint}
        />
      );
    case 'twitter':
      return (
        <Path
          d="M22 5.2a8.2 8.2 0 0 1-2.4.7 4.1 4.1 0 0 0 1.8-2.3c-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.8A11.7 11.7 0 0 1 3.3 4.1a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5a4.1 4.1 0 0 0 3.3 4.1c-.6.2-1.2.2-1.9.1a4.1 4.1 0 0 0 3.9 2.9A8.3 8.3 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.8v-.5A8.4 8.4 0 0 0 22 5.2Z"
          fill={tint}
        />
      );

    /* --- Home --- */
    case 'map-pin':
      return (
        <G {...p}>
          <Path d="M20 10.3c0 6-8 11.7-8 11.7s-8-5.7-8-11.7a8 8 0 0 1 16 0Z" />
          <Circle cx={12} cy={10.2} r={2.9} />
        </G>
      );
    case 'map-pinned':
      return (
        <G {...p}>
          <Path d="M12 21v-6" />
          <Path d="M8 12.4a2.6 2.6 0 0 1-1.4 2.3l-2.1 1.1a1.6 1.6 0 0 0-.9 1.4v1.5a1.3 1.3 0 0 0 1.3 1.3h14.2a1.3 1.3 0 0 0 1.3-1.3v-1.5a1.6 1.6 0 0 0-.9-1.4l-2.1-1.1a2.6 2.6 0 0 1-1.4-2.3V6.8A2.6 2.6 0 0 0 13.2 4H9.8a2.6 2.6 0 0 0-2.6 2.6Z" />
          <Circle cx={12} cy={7.6} r={1.5} />
        </G>
      );
    case 'shopping-cart':
      return (
        <G {...p}>
          <Circle cx={9.5} cy={20} r={1.3} />
          <Circle cx={18} cy={20} r={1.3} />
          <Path d="M2.5 3.5h2.2l2.4 11a1.8 1.8 0 0 0 1.8 1.4h8.8a1.8 1.8 0 0 0 1.8-1.4l1.4-6.6H6" />
        </G>
      );
    case 'search':
      return (
        <G {...p}>
          <Circle cx={11} cy={11} r={7.2} />
          <Path d="m20.5 20.5-4.2-4.2" />
        </G>
      );
    case 'house':
      return (
        <G {...p}>
          <Path d="M3.4 10.4 12 3.2l8.6 7.2" />
          <Path d="M5.4 9.2V20a1 1 0 0 0 1 1h11.2a1 1 0 0 0 1-1V9.2" />
          <Path d="M9.8 21v-6.4h4.4V21" />
        </G>
      );
    case 'receipt':
      return (
        <G {...p}>
          <Path d="M5 3h14v18l-2.3-1.4-2.4 1.4-2.3-1.4-2.4 1.4L7.3 20 5 21.4Z" />
          <Path d="M9 8h6" />
          <Path d="M9 12h6" />
        </G>
      );
    case 'badge-dollar':
      return (
        <G {...p}>
          <Path d="M12 2.6a9.4 9.4 0 1 1 0 18.8 9.4 9.4 0 0 1 0-18.8Z" />
          <Path d="M14.6 9.2H10.9a1.5 1.5 0 0 0 0 3h1.9a1.5 1.5 0 0 1 0 3H9.4" />
          <Path d="M12 6.6v10.8" />
        </G>
      );
    case 'bell':
      return (
        <G {...p}>
          <Path d="M18.2 9.4a6.2 6.2 0 1 0-12.4 0c0 5.1-2.1 6.9-2.1 6.9h16.6s-2.1-1.8-2.1-6.9Z" />
          <Path d="M13.7 19.6a2 2 0 0 1-3.4 0" />
        </G>
      );
    case 'menu':
      return (
        <G {...p}>
          <Path d="M4 7h16" />
          <Path d="M4 12h16" />
          <Path d="M4 17h16" />
        </G>
      );

    /* --- Chevrons / arrows --- */
    case 'arrow-right':
      return (
        <G {...p}>
          <Path d="M4.5 12h15" />
          <Path d="m13 5.5 6.5 6.5-6.5 6.5" />
        </G>
      );
    case 'arrow-left':
      return (
        <G {...p}>
          <Path d="M19.5 12h-15" />
          <Path d="m11 5.5-6.5 6.5 6.5 6.5" />
        </G>
      );
    case 'chevron-right':
      return <Path d="m9.5 5.5 6.5 6.5-6.5 6.5" {...p} />;
    case 'chevron-down':
      return <Path d="m5.5 9.5 6.5 6.5 6.5-6.5" {...p} />;
    case 'chevron-up':
      return <Path d="m5.5 14.5 6.5-6.5 6.5 6.5" {...p} />;
    case 'chevron-left':
      return <Path d="m14.5 5.5-6.5 6.5 6.5 6.5" {...p} />;

    /* --- Actions --- */
    case 'plus':
      return (
        <G {...p}>
          <Path d="M12 5v14" />
          <Path d="M5 12h14" />
        </G>
      );
    case 'minus':
      return <Path d="M5 12h14" {...p} />;
    case 'check':
      return <Path d="m4.5 12.5 5 5 10-11" {...p} />;
    case 'x':
      return (
        <G {...p}>
          <Path d="M6 6l12 12" />
          <Path d="M18 6 6 18" />
        </G>
      );
    case 'trash':
      return (
        <G {...p}>
          <Path d="M4 6.5h16" />
          <Path d="M9 6.5V4.8a1.2 1.2 0 0 1 1.2-1.2h3.6A1.2 1.2 0 0 1 15 4.8v1.7" />
          <Path d="M6 6.5 7 20a1.2 1.2 0 0 0 1.2 1.1h7.6A1.2 1.2 0 0 0 17 20l1-13.5" />
        </G>
      );
    case 'more-horizontal':
      return (
        <G>
          <Circle cx={5} cy={12} r={1.9} fill={tint} />
          <Circle cx={12} cy={12} r={1.9} fill={tint} />
          <Circle cx={19} cy={12} r={1.9} fill={tint} />
        </G>
      );

    /* --- Order details --- */
    case 'star':
      return (
        <Path
          d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.6l6.5-.9Z"
          fill={filled ? tint : 'none'}
          stroke={tint}
          strokeWidth={filled ? 0 : (p.strokeWidth ?? 2) * 0.85}
          strokeLinejoin="round"
        />
      );
    case 'clock':
      return (
        <G {...p}>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M12 6.8V12l3.4 2" />
        </G>
      );
    case 'store':
      return (
        <G {...p}>
          <Path d="M3.2 9.4h17.6v9.4a1.6 1.6 0 0 1-1.6 1.6H4.8a1.6 1.6 0 0 1-1.6-1.6Z" />
          <Path d="M2.6 9.4 4.8 3.8h14.4l2.2 5.6" />
          <Path d="M9.4 20.4v-5.6h5.2v5.6" />
        </G>
      );
    case 'home':
      return (
        <G {...p}>
          <Path d="M3.6 10.6 12 3.6l8.4 7" />
          <Path d="M5.6 9.4V20h12.8V9.4" />
          <Path d="M10 20v-5.4h4V20" />
        </G>
      );
    case 'phone':
      return (
        <G {...p}>
          <Path d="M7.2 3.4 9.4 8l-2 1.9a12 12 0 0 0 6.7 6.7L16 14.6l4.6 2.2v2.6a1.8 1.8 0 0 1-2 1.8A16.6 16.6 0 0 1 2.8 5.4a1.8 1.8 0 0 1 1.8-2Z" />
        </G>
      );
    case 'message-circle':
      return (
        <G {...p}>
          <Path d="M20.8 11.6a8.4 8.4 0 0 1-12.3 7.4L3.4 20.6l1.7-4.9a8.4 8.4 0 1 1 15.7-4.1Z" />
        </G>
      );
    case 'mail':
      return (
        <G {...p}>
          <Rect x={2.6} y={5} width={18.8} height={14} rx={2.4} />
          <Path d="m3.6 6.6 8.4 6.2 8.4-6.2" />
        </G>
      );
    case 'building':
      return (
        <G {...p}>
          <Rect x={4.2} y={3.4} width={15.6} height={17.2} rx={2} />
          <Path d="M8.4 7.4h2M13.6 7.4h2M8.4 11h2M13.6 11h2M8.4 14.6h2M13.6 14.6h2" />
          <Path d="M10.4 20.6v-3h3.2v3" />
        </G>
      );

    /* --- Activity timeline (Lucide) --- */
    case 'bike':
      return (
        <G {...p}>
          <Circle cx={5.5} cy={17.5} r={3.5} />
          <Circle cx={18.5} cy={17.5} r={3.5} />
          <Circle cx={15} cy={5} r={1} />
          <Path d="M12 17.5V14l-3-3 4-3 2 3h2" />
        </G>
      );
    case 'badge-check':
      return (
        <G {...p}>
          <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <Path d="m9 12 2 2 4-4" />
        </G>
      );
    case 'badge-percent':
      return (
        <G {...p}>
          <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <Path d="m15 9-6 6" />
          <Circle cx={15.5} cy={7.5} r={0.6} fill={tint} stroke="none" />
          <Circle cx={8.5} cy={15.5} r={0.6} fill={tint} stroke="none" />
        </G>
      );

    /* --- Savings (Lucide) --- */
    case 'ticket-percent':
      return (
        <G {...p}>
          <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <Path d="M9 9h.01" />
          <Path d="M15 15 9 9" />
          <Circle cx={15} cy={9} r={0.6} fill={tint} stroke="none" />
          <Circle cx={9} cy={15} r={0.6} fill={tint} stroke="none" />
        </G>
      );
    case 'tags':
      return (
        <G {...p}>
          <Path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
          <Path d="M9.6 4.6A2 2 0 0 0 8.2 4H4a2 2 0 0 0-2 2v4.2a2 2 0 0 0 .6 1.4l8.2 8.2a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z" />
          <Circle cx={7.5} cy={7.5} r={0.6} fill={tint} stroke="none" />
        </G>
      );
    case 'tag':
      return (
        <G {...p}>
          <Path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" />
          <Circle cx={7.5} cy={7.5} r={0.7} fill={tint} stroke="none" />
        </G>
      );
    case 'piggy-bank':
      return (
        <G {...p}>
          <Path d="M19 10c0-2.8-2.2-5-5-5H7.3a6 6 0 0 0 0 12H8v3l2-2h1a5.9 5.9 0 0 0 4.2-2l3.6 1.5V19a2 2 0 0 0 2-2v-3a4 4 0 0 0 0-4Z" />
          <Circle cx={16.5} cy={9.5} r={0.6} fill={tint} stroke="none" />
          <Path d="M21 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <Path d="M4.5 12a8.1 8.1 0 0 1 0-4" />
        </G>
      );
    default:
      return null;
  }
}
