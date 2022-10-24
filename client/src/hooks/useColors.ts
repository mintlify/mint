import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function useColors(): Colors {
  const { config } = useContext(ConfigContext);

  const primaryColor = config?.colors?.primary ?? '#a888ff';

  const anchors =
    config?.anchors?.map((anchor) => {
      if (anchor.color) {
        return anchor.color.toLowerCase();
      }
      return undefined;
    }) ?? [];

  return {
    primary: primaryColor,
    primaryLight: config?.colors?.light ?? '#c4b5fd',
    primaryDark: config?.colors?.dark ?? '#7c3aed',
    primaryUltraLight: config?.colors?.ultraLight ?? '#ddd6fe',
    primaryUltraDark: config?.colors?.ultraDark ?? '#5b21b6',
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
