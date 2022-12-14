import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { Gradient } from '@/types/gradient';

export function useColors(): Colors {
  const { mintConfig } = useContext(ConfigContext);

  const primaryColor = mintConfig?.colors?.primary ?? '#16A34A';

  const globalAnchorColor = colorToBackground(mintConfig?.colors?.anchors);
  const firstAnchorColor = colorToBackground(mintConfig?.topAnchor?.color) ?? globalAnchorColor;

  // Include the color for the first anchor even though the config object
  // doesn't define it explicitly
  const anchors = [firstAnchorColor];

  mintConfig?.anchors?.forEach((anchor) => {
    const anchorColor = colorToBackground(anchor.color) ?? globalAnchorColor;
    if (!anchorColor) return;

    anchors.push(anchorColor);
  });

  return {
    primary: primaryColor,
    primaryLight: mintConfig?.colors?.light ?? '#4ADE80',
    primaryDark: mintConfig?.colors?.dark ?? '#166534',
    primaryUltraLight: mintConfig?.colors?.ultraLight ?? '#DCFCE7',
    primaryUltraDark: mintConfig?.colors?.ultraDark ?? '#14532D',
    backgroundLight: mintConfig?.colors?.background?.light ?? '#ffffff',
    backgroundDark: mintConfig?.colors?.background?.dark ?? '#0f1117',
    anchors,
  };
}

/**
 * Will generate a linear-gradient if the color is a Gradient config.
 * If the color is a string, we just return the original.
 *
 * @param color Hex color or a Gradient config object
 * @returns Original hex color or a linear-gradient generated from the object
 */
function colorToBackground(color?: string | Gradient) {
  if (color == null) {
    return color;
  }

  if (typeof color === 'string') {
    return color;
  }

  // We have a gradient object if we are defined and not a string
  if (color.via) {
    return `linear-gradient(45deg, ${color.from}, ${color.via}, ${color.to})`;
  }
  return `linear-gradient(45deg, ${color.from}, ${color.to})`;
}

export type Colors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryUltraLight: string;
  primaryUltraDark: string;
  backgroundLight: string;
  backgroundDark: string;
  anchors: (string | undefined)[];
};
