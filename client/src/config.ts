import {
  AmplitudeConfigInterface,
  FathomConfigInterface,
  GoogleAnalyticsConfigInterface,
  HotjarConfigInterface,
  LogrocketConfigInterface,
  MixpanelConfigInterface,
  PostHogConfigInterface,
} from './analytics/AbstractAnalyticsImplementation';
import configJSON from './mint.json';

export const config: Config = configJSON;

export type NavigationEntry = string | Navigation;

export type Navigation = {
  group: string;
  pages: NavigationEntry[];
  version?: string;
};

type Logo = string | { light: string; dark: string; href?: string };

type NavbarLink = {
  url: string;
  type?: 'github' | 'link' | string;
  name?: string;
};

export type TopbarCta = NavbarLink;

export type Anchor = {
  name: string;
  url: string;
  icon?: string;
  color?: string;
  isDefaultHidden?: boolean;
  version?: string;
};

// To deprecate array types
type FooterSocial = {
  type: string;
  url: string;
};

type Analytics = {
  amplitude?: AmplitudeConfigInterface;
  fathom?: FathomConfigInterface;
  ga4?: GoogleAnalyticsConfigInterface;
  logrocket?: LogrocketConfigInterface;
  hotjar?: HotjarConfigInterface;
  mixpanel?: MixpanelConfigInterface;
  posthog?: PostHogConfigInterface;
};

type Integrations = {
  intercom?: string;
};

type FooterSocials = Record<string, string>;

export type Config = {
  mintlify?: string;
  name: string;
  basePath?: string;
  logo?: Logo;
  favicon?: string;
  openApi?: string;
  api?: {
    baseUrl?: string | string[];
    auth?: {
      method: string; // 'key', 'bearer', or 'basic'
      name?: string;
      inputPrefix?: string;
    };
  };
  modeToggle?: {
    default?: string; // 'light' or 'dark'
    isHidden?: boolean;
  };
  versions?: string[];
  metadata?: any;
  colors?: {
    primary: string;
    light?: string;
    dark?: string;
    ultraLight?: string;
    ultraDark?: string;
    background?: {
      light?: string;
      dark?: string;
    };
  };
  topbarCtaButton?: NavbarLink;
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
    navigationItem?: string;
    logo?: string;
  };
  backgroundImage?: string;
  analytics?: Analytics;
  integrations?: Integrations;
  __injected?: {
    analytics?: Analytics;
  };
};

export const findFirstNavigationEntry = (
  group: Navigation,
  target: string
): NavigationEntry | undefined => {
  return group.pages.find((page) => {
    if (typeof page === 'string') {
      return page.includes(target);
    } else {
      return findFirstNavigationEntry(page, target);
    }
  });
};
