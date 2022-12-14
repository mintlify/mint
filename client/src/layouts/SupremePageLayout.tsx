import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Router from 'next/router';
import Script from 'next/script';
import { useState, useEffect } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';
import GA4Script from '@/analytics/GA4Script';
import GTMScript from '@/analytics/GTMScript';
import { useAnalytics } from '@/analytics/useAnalytics';
import components from '@/components';
import { ConfigContext } from '@/context/ConfigContext';
import { VersionContextController } from '@/context/VersionContext';
import useProgressBar from '@/hooks/useProgressBar';
import Intercom from '@/integrations/Intercom';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { ColorVariables } from '@/ui/ColorVariables';
import { FeedbackProvider } from '@/ui/Feedback';
import { SearchProvider } from '@/ui/search/Search';
import { getAllMetaTags } from '@/utils/getAllMetaTags';
import { getAnalyticsConfig } from '@/utils/getAnalyticsConfig';
import PlausibleScript from '@/analytics/PlausibleScript';

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
    navWithMetadata: Groups;
    pageMetadata: PageMetaTags;
  };
  config: Config;
  openApi: any;
  favicons: FaviconsProps;
  subdomain: string;
}) {
  useProgressBar(config?.colors?.primary);
  const { navWithMetadata, pageMetadata } = parsedData;
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

  const metaTagsDict = getAllMetaTags(pageMetadata, config.metadata || {});

  return (
    <Intercom appId={config.integrations?.intercom} autoBoot>
      <VersionContextController versionOptions={config?.versions}>
        <ConfigContext.Provider value={{ config, navWithMetadata, openApi, subdomain }}>
          <AnalyticsContext.Provider value={analyticsMediator}>
            <ColorVariables />
            <Head>
              {favicons.icons.map((favicon) => (
                <link
                  rel={favicon.rel}
                  type={favicon.type}
                  sizes={favicon.sizes}
                  href={favicon.href}
                  key={favicon.href}
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
              <title>{metaTagsDict['og:title']}</title>
              {Object.entries(metaTagsDict).map(([key, value]) => (
                <meta key={key} name={key} content={value as any} />
              ))}
            </Head>
            <Script
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                try {
                  if (localStorage.isDarkMode === 'dark' || (${(
                    config.modeToggle?.default == null
                  ).toString()} && !('isDarkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) || ${(
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
            <GTMScript gtm={analyticsConfig.gtm} />
            <PlausibleScript plausible={analyticsConfig.plausible} />
            <FeedbackProvider subdomain={subdomain}>
              <SearchProvider subdomain={subdomain}>
                <div className="relative antialiased text-slate-500 dark:text-slate-400">
                  <span className="fixed inset-0 bg-background-light dark:bg-background-dark"></span>
                  <span
                    className="z-0 fixed inset-0"
                    {...(config.backgroundImage && {
                      style: {
                        backgroundImage: `url('${config.backgroundImage}')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top right',
                        backgroundAttachment: 'fixed',
                      },
                    })}
                  ></span>
                  <DocumentationLayout
                    navWithMetadata={navWithMetadata}
                    navIsOpen={navIsOpen}
                    setNavIsOpen={setNavIsOpen}
                    pageMetadata={pageMetadata}
                  >
                    <MDXRemote components={components} {...mdxSource} />
                  </DocumentationLayout>
                </div>
              </SearchProvider>
            </FeedbackProvider>
          </AnalyticsContext.Provider>
        </ConfigContext.Provider>
      </VersionContextController>
    </Intercom>
  );
}
