// import axios from 'axios';
// const API_ENDPOINT = process.env.API_ENDPOINT;
// import ProgressBar from '@badrap/bar-of-progress';
import { ResizeObserver } from '@juggle/resize-observer';
import 'focus-visible';
import 'intersection-observer';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Router from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useState, useEffect } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';
import GA4Script from '@/analytics/GA4Script';
import { useAnalytics } from '@/analytics/useAnalytics';
import components from '@/components';
import ConfigContext from '@/context/ConfigContext';
import { VersionContextController } from '@/context/VersionContext';
import Intercom from '@/integrations/Intercom';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import type { Config } from '@/types/config';
import { Groups, PageMetaTags, findPageInGroup, META_TAGS_FOR_LAYOUT } from '@/types/metadata';
import { Header } from '@/ui/Header';
import { SearchProvider } from '@/ui/Search';
import { Title } from '@/ui/Title';
import { getAnalyticsConfig } from '@/utils/getAnalyticsConfig';
import getMdxSource from '@/utils/mdx/getMdxSource';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}
// TODO - Add ProgessBar back when you can access color. (Put inside Page component?)
// const progress = new ProgressBar({
//   size: 2,
//   color: config?.colors?.primary ?? '#0C8C5E',
//   className: 'bar-of-progress',
//   delay: 100,
// });

// // this fixes safari jumping to the bottom of the page
// // when closing the search modal using the `esc` key
// if (typeof window !== 'undefined') {
//   progress.start();
//   progress.finish();
// }

// Router.events.on('routeChangeStart', () => progress.start());
// Router.events.on('routeChangeComplete', () => progress.finish());
// Router.events.on('routeChangeError', () => progress.finish());
interface PageProps {
  stringifiedMdxSource: string;
  stringifiedData: string;
}

interface ParsedDataProps {
  siteMetadata: Groups;
  meta: PageMetaTags;
  section: string | undefined;
  metaTagsForSeo: PageMetaTags;
  title: string;
  config: Config;
}

export default function Page({ stringifiedMdxSource, stringifiedData }: PageProps) {
  const mdxSource = JSON.parse(stringifiedMdxSource);
  const { meta, section, metaTagsForSeo, title, config } = JSON.parse(
    stringifiedData
  ) as ParsedDataProps;

  const analyticsConfig = getAnalyticsConfig(config);
  const analyticsMediator = useAnalytics(analyticsConfig);

  let [navIsOpen, setNavIsOpen] = useState(false);

  useEffect(() => {
    if (!navIsOpen) return;
    function handleRouteChange() {
      setNavIsOpen(false);
    }
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [navIsOpen]);

  return (
    <Intercom appId={config.integrations?.intercom} autoBoot>
      <VersionContextController>
        <ConfigContext.Provider value={config}>
          <AnalyticsContext.Provider value={analyticsMediator}>
            <Title suffix={config.name}>{title}</Title>
            <Head>
              {config?.metadata &&
                Object.entries(config?.metadata).map(([key, value]) => {
                  if (!value) {
                    return null;
                  }
                  return <meta key={key} name={key} content={value as any} />;
                })}
              {Object.entries(metaTagsForSeo).map(([key, value]) => (
                <meta key={key} name={key} content={value as any} />
              ))}
            </Head>
            <GA4Script ga4={analyticsConfig.ga4} />
            <SearchProvider>
              <Header
                hasNav={Boolean(config.navigation?.length)}
                navIsOpen={navIsOpen}
                onNavToggle={(isOpen: boolean) => setNavIsOpen(isOpen)}
                title={meta?.title}
                section={section}
              />
              <DocumentationLayout navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen} meta={meta}>
                <MDXRemote components={components} {...mdxSource} />
              </DocumentationLayout>
            </SearchProvider>
          </AnalyticsContext.Provider>
        </ConfigContext.Provider>
      </VersionContextController>
    </Intercom>
  );
}

interface PathProps extends ParsedUrlQuery {
  site: string;
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  // const { data }: { data: Record<string, string[][]> } = await axios.get(
  //   `${API_ENDPOINT}/api/v1/admin/build/paths`,
  //   {
  //     headers: { Authorization: `Bearer ${process.env.INTERNAL_SITE_BEARER_TOKEN}` },
  //   }
  // );
  // const paths = Object.entries(data).flatMap(
  //   ([subdomain, pathsForSubdomain]: [string, string[][]]) => {
  //     return pathsForSubdomain.map((pathForSubdomain) => ({
  //       params: { site: subdomain, slug: pathForSubdomain },
  //     }));
  //   }
  // );
  return {
    paths: [
      {
        params: {
          site: 'mintlify',
          slug: ['hello'],
        },
      },
    ],
    fallback: true, // TODO: Change this to true once ISR is implemented https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-true
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { site, slug } = params;
  const path = slug.join('/');

  // TODO - get all the data (page data AND global data (metadata, openApi, config))
  const content: string = `---
  title: 'Quickstart'
  description: 'Get up and running with your existing workflow'
  ---
  
  <Note>
  
  Mintlify is in a private beta. [Sign up](https://mintlify.com/start) on our waitlist to get access.
  
  </Note>
  
  ## Setup
  
  ### Basic Configuration
  
  Every Mintlify site needs a \`mint.json\` file with the core configuration settings added. You can learn more about the structure of the config file at the [customization guide](/settings/customization).
  
  ### Automatic Deployments
  
  Once the files are ready for deployment, you can choose to host your docs from your source control provider. Follow one of the following guides to set up deployment.
  
  <Accordion title="GitHub Setup Guide" icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
  }>
  
  ## GitHub Setup Guide
  
  ### Open a Public Repo
  
  Create a public repo where you would like to host the documentation.
  
  <Tip>
    You can also use a private repo but it prevents users from suggesting changes
    and raising issues.
  </Tip>
  
  ### Add Files
  
  The onboarding team will provide a zip file with the contents of the documentation. Unzip the file and add the contents into a \` /
    docs\` directory of the repo.
  
  The result should look something like this.
  
  
  ### Install the GitHub Bot
  
  Install the Mintlify GitHub Bot using request link provided by the onboarding team. Make sure it's granted access to the repo with the documentation.
  
  Now, when you make changes to the docs and push them to the main branch, it will automatically deploy to your documentation page!
  
  </Accordion>
  
  <Accordion title="GitLab Setup Guide" icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill-rule="evenodd"
      >
        <path d="M32 61.477L43.784 25.2H20.216z" fill="#e24329" />
        <path d="M32 61.477L20.216 25.2H3.7z" fill="#fc6d26" />
        <path d="M3.7 25.2L.12 36.23a2.44 2.44 0 0 0 .886 2.728L32 61.477z" fill="#fca326" />
        <path d="M3.7 25.2h16.515L13.118 3.366c-.365-1.124-1.955-1.124-2.32 0z" fill="#e24329" />
        <path d="M32 61.477L43.784 25.2H60.3z" fill="#fc6d26" />
        <path d="M60.3 25.2l3.58 11.02a2.44 2.44 0 0 1-.886 2.728L32 61.477z" fill="#fca326" />
        <path d="M60.3 25.2H43.784l7.098-21.844c.365-1.124 1.955-1.124 2.32 0z" fill="#e24329" />
      </svg>
  }>
  
  ## GitLab Setup Guide
  
  ### API Authentication
  
  Our endpoints use bearer token authentication. We will send you your token when you sign up with Mintlify. Please contact us if you need more tokens or need to delete one.
  
  ### Generate a GitLab access token
  
  You can use a [Personal Access Tokens](https://gitlab.com/-/profile/personal_access_tokens) if you are on GitLab's free tier or a Project Access Token if you are on their paid tier.
  
  The token needs \`read_api\` and \`read_repository\` permissions. We recommend setting an expiration at least one year in the future.
  
  
  ### Get your Project ID from your project's home page
  
  
  ### Send us your GitLab access token
  
  Make a \`PUT\` request to \`https://docs.mintlify.com/api/v1/sites/integrations/gitlab\` with your bearer token in the header.
  
  The body should be a JSON object of the form:
  
  \`\`\`json body
  {
      accessToken: your gitlab access token,
      projectId: your project ID,
      deployBranch: "main" or "master" depending on your repository's default
  }
  \`\`\`
  
  You can always update your access token by making \`PUT\` requests to the endpoint. You can also verify you set it correctly by making a \`GET\` request. Lastly, you can delete your token with a \`DELETE\` request.
  
  ### Create a GitLab webhook
  
  On your project page go to Settings > Webhooks. Enter \`https://docs.mintlify.com/api/v1/sites/deploys/gitlab-listener\` as the webhook URL. Enter your bearer token as the secret. Make the trigger run on push events to your deploy branch, likely "main" or "master" depending on your repository.
  
  </Accordion>`;
  const config = `{
    "name": "Mintlify",
    "basePath": "/docs",
    "logo": {
      "light": "/docs/logo/light.svg",
      "dark": "/docs/logo/dark.svg",
      "href": "https://mintlify.com"
    },
    "favicon": "/favicon.svg",
    "colors": {
      "primary": "#16A34A",
      "light": "#4ADE80",
      "dark": "#166534",
      "ultraLight": "#DCFCE7",
      "ultraDark": "#14532D"
    },
    "topbarLinks": [
      {
        "name": "Contact Sales",
        "url": "mailto:hi@mintlify.com"
      }
    ],
    "topbarCtaButton": {
      "name": "Get Started",
      "url": "https://mintlify.com/start"
    },
    "anchors": [
      {
        "name": "Community",
        "icon": "comments",
        "color": "#2564eb",
        "url": "https://discord.gg/b499CK8P9g"
      },
      {
        "name": "GitHub",
        "icon": "github",
        "color": "#333333",
        "url": "https://github.com/mintlify/mint"
      }
    ],
    "navigation": [
      {
        "group": "Getting Started",
        "pages": ["quickstart"]
      },
      {
        "group": "Settings",
        "pages": ["settings/customization", "settings/page"]
      },
      {
        "group": "Components",
        "pages": [
          "components/overview",
          "components/accordion",
          "components/callout",
          "components/card",
          "components/code",
          "components/embed",
          "components/image",
          "components/frame",
          "components/list",
          "components/text",
          "components/table"
        ]
      },
      {
        "group": "API Components",
        "pages": [
          "api-components/overview",
          "api-components/param",
          "api-components/response",
          "api-components/expandable",
          "api-components/examples",
          "api-components/openapi"
        ]
      },
      {
        "group": "Analytics",
        "pages": [
          "site-stats/setup",
          "site-stats/ga4",
          "site-stats/amplitude",
          "site-stats/mp",
          "site-stats/posthog"
        ]
      }
    ],
    "footerSocials": {
      "github": "https://github.com/mintlify",
      "discord": "https://discord.gg/MPNgtSZkgK",
      "twitter": "https://twitter.com/mintlify"
    },
    "analytics": {
      "fathom": {
        "siteId": "YSVUHCAK"
      }
    }
  }`;
  const siteMetadata: Groups = [
    {
      group: 'Home',
      pages: [
        {
          title: 'Hello World',
          description: 'hello',
          href: 'hello',
        },
      ],
    },
  ];
  let section = undefined;
  let meta: PageMetaTags = {};
  siteMetadata.forEach((group) => {
    const foundPage = findPageInGroup(group, path);
    if (foundPage) {
      section = group.group;
      meta = foundPage.page;
      return false;
    }
    return true;
  });
  const metaTagsForSeo: PageMetaTags = {};
  Object.entries(meta).forEach(([key, value]) => {
    if (META_TAGS_FOR_LAYOUT.includes(key)) return;
    metaTagsForSeo[key as keyof PageMetaTags] = value;
  });
  const title = meta.sidebarTitle || meta.title;

  const mdxSource = await getMdxSource(content, { section, meta });
  return {
    props: {
      stringifiedMdxSource: JSON.stringify(mdxSource),
      stringifiedData: JSON.stringify({
        siteMetadata,
        meta,
        section,
        metaTagsForSeo,
        title,
        config,
      }),
    },
  };
};
