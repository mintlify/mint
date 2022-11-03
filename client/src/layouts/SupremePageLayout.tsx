import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Router from 'next/router';
import Script from 'next/script';
import { useState, useEffect } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';
import GA4Script from '@/analytics/GA4Script';
import { useAnalytics } from '@/analytics/useAnalytics';
import components from '@/components';
import { ConfigContext } from '@/context/ConfigContext';
import { VersionContextController } from '@/context/VersionContext';
import Intercom from '@/integrations/Intercom';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import { Config } from '@/types/config';
import { Groups, PageMetaTags } from '@/types/metadata';
import { ColorVariables } from '@/ui/ColorVariables';
import { Header } from '@/ui/Header';
import { SearchProvider } from '@/ui/Search';
import { Title } from '@/ui/Title';
import { getAnalyticsConfig } from '@/utils/getAnalyticsConfig';

interface FaviconsProps {
  icons: {
    rel: string;
    href: string;
    type: string;
    sizes?: string;
  }[];
  browserconfig: string;
}

// First Layout used by every page inside [[..slug]]
export default function SupremePageLayout({
  mdxSource,
  parsedData,
  config,
  openApi,
  favicons,
  subdomain,
}: {
  mdxSource: any;
  parsedData: {
    nav: Groups;
    meta: PageMetaTags;
    section: string | undefined;
    metaTagsForSeo: PageMetaTags;
    title: string;
  };
  config: Config;
  openApi: any;
  favicons: FaviconsProps;
  subdomain: string;
}) {
  const { meta, section, metaTagsForSeo, title, nav } = parsedData;
  let [navIsOpen, setNavIsOpen] = useState(false);

  const analyticsConfig = getAnalyticsConfig(config);
  const analyticsMediator = useAnalytics(analyticsConfig);

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
      <VersionContextController versionOptions={config?.versions}>
        <ConfigContext.Provider value={{ config, nav, openApi }}>
          <AnalyticsContext.Provider value={analyticsMediator}>
            <ColorVariables />
            <Title suffix={config.name}>{title}</Title>
            <Head>
              {favicons.icons.map((favicon) => (
                <link
                  rel={favicon.rel}
                  type={favicon.type}
                  sizes={favicon.sizes}
                  href={favicon.href}
                />
              ))}
              <meta name="msapplication-config" content={favicons.browserconfig} />
              <meta name="apple-mobile-web-app-title" content={config.name} />
              <meta name="application-name" content={config.name} />
              <meta name="theme-color" content="#ffffff" />
              <meta name="msapplication-TileColor" content={config.colors?.primary} />
              <meta name="theme-color" content="#ffffff" />
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
            <Script
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                try {
                  if (localStorage.theme === 'dark' || (${(
                    config.modeToggle?.default == null
                  ).toString()} && !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) || ${(
                  config.modeToggle?.default === 'dark'
                ).toString()}) {
                    document.documentElement.classList.add('dark')
                  }
                  
                  else {
                    document.documentElement.classList.remove('dark')
                  }
                } catch (_) {}
              `,
              }}
            />
            <GA4Script ga4={analyticsConfig.ga4} />
            <SearchProvider subdomain={subdomain}>
              <div
                className="antialiased bg-background-light dark:bg-background-dark text-slate-500 dark:text-slate-400"
                // Add background image
                {...(config.backgroundImage && {
                  style: {
                    background: `url('${config.backgroundImage}') no-repeat fixed top right`,
                  },
                })}
              >
                <Header
                  hasNav={Boolean(config.navigation?.length)}
                  navIsOpen={navIsOpen}
                  onNavToggle={(isOpen: boolean) => setNavIsOpen(isOpen)}
                  title={meta?.title}
                  section={section}
                />
                <DocumentationLayout
                  nav={nav}
                  navIsOpen={navIsOpen}
                  setNavIsOpen={setNavIsOpen}
                  meta={meta}
                >
                  <MDXRemote components={components} {...mdxSource} />
                </DocumentationLayout>
              </div>
            </SearchProvider>
          </AnalyticsContext.Provider>
        </ConfigContext.Provider>
      </VersionContextController>
    </Intercom>
  );
}
