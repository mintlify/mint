import {
  AmplitudeConfigInterface,
  FathomConfigInterface,
  HotjarConfigInterface,
  MixpanelConfigInterface,
  PostHogConfigInterface,
} from './analytics/AbstractAnalyticsImplementation';
import configJSON from './config.json';

export const config: Config = configJSON;

export type Page = string | Navigation;

export type Navigation = {
  group: string;
  pages: Page[];
};

type Logo = string | { light: string; dark: string };

type NavbarLink = {
  name: string;
  url: string;
};

type Anchor = {
  name: string;
  url: string;
  icon?: string;
  color?: string;
  isDefaultHidden?: boolean;
};

// To deprecate array types
type FooterSocial = {
  type: string;
  url: string;
};

type Analytics = {
  amplitude?: AmplitudeConfigInterface;
  fathom?: FathomConfigInterface;
  hotjar?: HotjarConfigInterface;
  mixpanel?: MixpanelConfigInterface;
  posthog?: PostHogConfigInterface;
};

type FooterSocials = Record<string, string>;

export type Config = {
  mintlify?: string;
  name: string;
  basePath?: string;
  logo?: Logo;
  logoHref?: string;
  favicon?: string;
  openApi?: string;
  api?: {
    baseUrl?: string | string[];
    auth?: {
      method: string; // 'key', 'bearer', or 'basic'
      name?: string;
    };
  };
  colors?: {
    primary: string;
    light?: string;
    dark?: string;
    ultraLight?: string;
    ultraDark?: string;
    background?: {
      light: string;
      dark: string;
    };
  };
  topbarCtaButton?: {
    name: string;
    url: string;
  };
  topbarLinks?: NavbarLink[];
  navigation?: Navigation[];
  topAnchor?: {
    name: string;
  };
  anchors?: Anchor[];
  footerSocials?: FooterSocial[] | FooterSocials;
  classes?: {
    anchors?: string;
    activeAnchors?: string;
    topbarCtaButton?: string;
  };
  analytics?: Analytics;
  __injected?: {
    analytics?: Analytics;
  };
};

export const findFirstPage = (group: Navigation, target: string): Page | undefined => {
  return group.pages.find((page) => {
    if (typeof page === 'string') {
      return page.includes(target);
    } else {
      return findFirstPage(page, target);
    }
  });
};
