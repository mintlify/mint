// import ProgressBar from '@badrap/bar-of-progress';
import { ResizeObserver } from '@juggle/resize-observer';
import { stringify, parse } from 'flatted';
import 'focus-visible';
import 'intersection-observer';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Router from 'next/router';
import Script from 'next/script';
import type { ParsedUrlQuery } from 'querystring';
import { useState, useEffect } from 'react';

import AnalyticsContext from '@/analytics/AnalyticsContext';
import GA4Script from '@/analytics/GA4Script';
import { useAnalytics } from '@/analytics/useAnalytics';
import components from '@/components';
import { ConfigContext } from '@/context/ConfigContext';
import { VersionContextController } from '@/context/VersionContext';
import Intercom from '@/integrations/Intercom';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import { getPage } from '@/lib/page';
import { getPaths } from '@/lib/paths';
import type { Config } from '@/types/config';
import { Groups, PageMetaTags } from '@/types/metadata';
import { ColorVariables } from '@/ui/ColorVariables';
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
  stringifiedFavicons: string;
  subdomain: string;
}

interface ParsedDataProps {
  nav: Groups;
  meta: PageMetaTags;
  section: string | undefined;
  metaTagsForSeo: PageMetaTags;
  title: string;
  stringifiedConfig: string;
  stringifiedOpenApi?: string;
}

interface FaviconsProps {
  icons: {
    rel: string;
    href: string;
    type: string;
    sizes?: string;
  }[];
  browserconfig: string;
}

// TODO - handle incorrect urls
export default function Page({
  stringifiedMdxSource,
  stringifiedData,
  stringifiedFavicons,
  subdomain,
}: PageProps) {
  const mdxSource = parse(stringifiedMdxSource);
  const { meta, section, metaTagsForSeo, title, stringifiedConfig, nav, stringifiedOpenApi } =
    parse(stringifiedData) as ParsedDataProps;
  const config = JSON.parse(stringifiedConfig) as Config;
  const openApi = stringifiedOpenApi ? JSON.parse(stringifiedOpenApi) : {};
  const favicons = parse(stringifiedFavicons) as FaviconsProps;
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

  try {
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
  } catch (e) {
    return (
      <div>
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto py-12 sm:py-20">
            <div className="text-center">
              <p className="text-xl font-semibold text-primary dark:text-primary-light">500</p>
              <h1 className="mt-2 text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight sm:text-4xl sm:tracking-tight">
                Page building error
              </h1>
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                We could not generate this page
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

interface PathProps extends ParsedUrlQuery {
  subdomain: string;
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const data: Record<string, string[][]> = await getPaths();
  const paths = Object.entries(data).flatMap(
    ([subdomain, pathsForSubdomain]: [string, string[][]]) => {
      return pathsForSubdomain.map((pathForSubdomain) => ({
        params: { subdomain, slug: pathForSubdomain },
      }));
    }
  );
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { subdomain, slug } = params;
  const path = slug ? slug.join('/') : 'index';

  const { data, status } = await getPage(subdomain, path);
  if (status === 404) {
    return {
      notFound: true,
    };
  }
  if (status === 308) {
    const { redirect }: { redirect: { destination: string; permanent: boolean } } = data;
    return { redirect };
  }
  if (status === 200) {
    const {
      content,
      stringifiedConfig,
      nav,
      section,
      meta,
      metaTagsForSeo,
      title,
      stringifiedOpenApi,
      favicons,
    }: {
      content: string;
      stringifiedConfig: string;
      nav: Groups;
      section: string;
      meta: PageMetaTags;
      metaTagsForSeo: PageMetaTags;
      title: string;
      stringifiedOpenApi?: string;
      favicons: FaviconsProps;
    } = data;
    let mdxSource: any = '';
    try {
      const response = await getMdxSource(content, { section, meta });
      mdxSource = response;
    } catch (err) {
      console.log(err);
    }

    return {
      props: {
        stringifiedMdxSource: stringify(mdxSource),
        stringifiedData: stringify({
          nav,
          meta,
          section,
          metaTagsForSeo,
          title,
          stringifiedConfig,
          stringifiedOpenApi,
        }),
        stringifiedFavicons: stringify(favicons),
        subdomain,
      },
    };
  }
  return {
    notFound: true,
  };
};
