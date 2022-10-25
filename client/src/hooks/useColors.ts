import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function useColors(): Colors {
  const { config } = useContext(ConfigContext);

  const primaryColor = config?.colors?.primary ?? '#16A34A';

  const anchors =
    config?.anchors?.map((anchor) => {
      if (anchor.color) {
        return anchor.color;
      }
      return primaryColor;
    }) ?? [];

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
