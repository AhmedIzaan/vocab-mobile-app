import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export function Icon({ name, size = 24, color = '#1F1B16', filled = false }) {
  const c = color;
  const sw = size < 18 ? '1.2' : '1.4';

  switch (name) {
    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M8 1.5c.5 2 2 2.8 2.5 4.2.6 1.6-.2 3-.8 3.4.7-1.2.2-2.4-.5-3 .2 1.8-.9 2.4-1.4 3.6-.5 1.2 0 2.5 1 3 .2 0-1.8.3-3-1-1.4-1.5-1-3.7-.2-5C6.5 5.3 5.5 4.2 6 3c.4-.8 2 0 2-1.5z"
            stroke={c} strokeWidth="1.1" strokeLinejoin="round"
          />
        </Svg>
      );
    case 'book':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path d="M3 3h4c.8 0 1.5.5 1.5 1.2V13c0-.7-.7-1.2-1.5-1.2H3V3z" stroke={c} strokeWidth="1.1" />
          <Path d="M13 3H9c-.8 0-1.5.5-1.5 1.2V13c0-.7.7-1.2 1.5-1.2h4V3z" stroke={c} strokeWidth="1.1" />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M8 2l1.6 3.8 4.1.4-3.1 2.7.9 4-3.5-2.1-3.5 2.1.9-4L2.3 6.2l4.1-.4L8 2z"
            stroke={c} strokeWidth="1.1" strokeLinejoin="round"
          />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <Path d="M2.5 7.5L6 11l5.5-7.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'arrow':
      return (
        <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <Path d="M2 7h10M8 3l4 4-4 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
          <Path d="M3 3l8 8M11 3l-8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      );
    case 'speaker':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path d="M3 6h2l3-2.5v9L5 10H3V6z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          <Path d="M10.5 5.5c1 .8 1 3.2 0 4" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
          <Path d="M12 4c1.8 1.5 1.8 6.5 0 8" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </Svg>
      );
    case 'bookmark':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M4 2h8v12l-4-3-4 3V2z"
            stroke={c} strokeWidth="1.2" strokeLinejoin="round"
            fill={filled ? c : 'none'}
          />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Path
            d="M3 9l7-6 7 6v8h-5v-5H8v5H3V9z"
            stroke={c} strokeWidth={sw}
            fill={filled ? c : 'none'} strokeLinejoin="round"
          />
        </Svg>
      );
    case 'library':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Rect x="3" y="3" width="3" height="14" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} />
          <Rect x="8" y="5" width="3" height="12" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} />
          <Rect x="13" y="2" width="4" height="15" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} transform="rotate(8 15 9)" />
        </Svg>
      );
    case 'chart':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Rect x="3" y="11" width="3" height="6" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} />
          <Rect x="8.5" y="7" width="3" height="10" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} />
          <Rect x="14" y="4" width="3" height="13" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} />
        </Svg>
      );
    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Circle cx="10" cy="7" r="3.2" stroke={c} strokeWidth={sw} fill={filled ? c : 'none'} />
          <Path
            d="M3.5 17c.8-3.3 3.3-5 6.5-5s5.7 1.7 6.5 5"
            stroke={c} strokeWidth={sw} strokeLinecap="round"
          />
        </Svg>
      );
    default:
      return null;
  }
}
