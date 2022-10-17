import {
  AmplitudeConfigInterface,
  FathomConfigInterface,
  GoogleAnalyticsConfigInterface,
  HotjarConfigInterface,
  LogrocketConfigInterface,
  MixpanelConfigInterface,
  PostHogConfigInterface,
} from './analytics/AbstractAnalyticsImplementation';

// TODO - get config data from backend
export const config: Config = {
  name: 'Mintlify',
  basePath: '/docs',
  logo: {
    light: '/docs/logo/light.svg',
    dark: '/docs/logo/dark.svg',
    href: 'https://mintlify.com',
  },
  favicon: '/favicon.svg',
  colors: {
    primary: '#16A34A',
    light: '#4ADE80',
    dark: '#166534',
    ultraLight: '#DCFCE7',
    ultraDark: '#14532D',
  },
  topbarLinks: [
    {
      name: 'Contact Sales',
      url: 'mailto:hi@mintlify.com',
    },
  ],
  topbarCtaButton: {
    name: 'Get Started',
    url: 'https://mintlify.com/start',
  },
  anchors: [
    {
      name: 'Community',
      icon: 'comments',
      color: '#2564eb',
      url: 'https://discord.gg/b499CK8P9g',
    },
    {
      name: 'GitHub',
      icon: 'github',
      color: '#333333',
      url: 'https://github.com/mintlify/mint',
    },
  ],
  navigation: [
    {
      group: 'Getting Started',
      pages: ['quickstart'],
    },
    {
      group: 'Settings',
      pages: ['settings/customization', 'settings/page'],
    },
    {
      group: 'Components',
      pages: [
        'components/overview',
        'components/accordion',
        'components/callout',
        'components/card',
        'components/code',
        'components/embed',
        'components/image',
        'components/frame',
        'components/list',
        'components/text',
        'components/table',
      ],
    },
    {
      group: 'API Components',
      pages: [
        'api-components/overview',
        'api-components/param',
        'api-components/response',
        'api-components/expandable',
        'api-components/examples',
        'api-components/openapi',
      ],
    },
    {
      group: 'Analytics',
      pages: [
        'site-stats/setup',
        'site-stats/ga4',
        'site-stats/amplitude',
        'site-stats/mp',
        'site-stats/posthog',
      ],
    },
  ],
  footerSocials: {
    github: 'https://github.com/mintlify',
    discord: 'https://discord.gg/MPNgtSZkgK',
    twitter: 'https://twitter.com/mintlify',
  },
  analytics: {
    fathom: {
      siteId: 'YSVUHCAK',
    },
  },
};

export type NavigationEntry = string | Navigation;

export type Navigation = {
  group: string;
  pages: NavigationEntry[];
};

type Logo = string | { light: string; dark: string; href?: string };

type NavbarLink = {
  url: string;
  type?: 'github' | 'link' | string;
  name?: string;
};

export type TopbarCta = NavbarLink;

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
