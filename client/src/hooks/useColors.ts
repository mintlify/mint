import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { Gradient } from '@/types/gradient';

export function useColors(): Colors {
  const { config } = useContext(ConfigContext);

  const primaryColor = config?.colors?.primary ?? '#16A34A';

  const defaultAnchorColor = colorToBackground(config?.colors?.anchors) ?? primaryColor;
  const firstAnchorColor = colorToBackground(config?.topAnchor?.color);

  // Include the color for the first anchor even though the config object
  // doesn't define it explicitly
  const anchors = [firstAnchorColor];

  config?.anchors?.forEach((anchor) => {
    const anchorColor = colorToBackground(anchor.color);
    if (!anchorColor) return;

    anchors.push(anchorColor);
  });

  return {
    primary: primaryColor,
    primaryLight: config?.colors?.light ?? '#4ADE80',
    primaryDark: config?.colors?.dark ?? '#166534',
    primaryUltraLight: config?.colors?.ultraLight ?? '#DCFCE7',
    primaryUltraDark: config?.colors?.ultraDark ?? '#14532D',
    backgroundLight: config?.colors?.background?.light ?? '#ffffff',
    backgroundDark: config?.colors?.background?.dark ?? '#0C1322',
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
