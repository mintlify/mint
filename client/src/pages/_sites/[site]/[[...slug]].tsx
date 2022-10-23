// import ProgressBar from '@badrap/bar-of-progress';
import { ResizeObserver } from '@juggle/resize-observer';
import axios from 'axios';
import { stringify, parse } from 'flatted';
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
import SiteContext from '@/context/SiteContext';
import { VersionContextController } from '@/context/VersionContext';
import Intercom from '@/integrations/Intercom';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import type { Config } from '@/types/config';
import { Groups, PageMetaTags } from '@/types/metadata';
import { Header } from '@/ui/Header';
import { SearchProvider } from '@/ui/Search';
import { Title } from '@/ui/Title';
import { getAnalyticsConfig } from '@/utils/getAnalyticsConfig';
import getMdxSource from '@/utils/mdx/getMdxSource';

const API_ENDPOINT = process.env.API_ENDPOINT;

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
  nav: Groups;
  meta: PageMetaTags;
  section: string | undefined;
  metaTagsForSeo: PageMetaTags;
  title: string;
  config: Config;
  openApi?: any;
}
// TODO - handle incorrect urls
export default function Page({ stringifiedMdxSource, stringifiedData }: PageProps) {
  const mdxSource = JSON.parse(stringifiedMdxSource);
  const { meta, section, metaTagsForSeo, title, config, nav, openApi } = parse(
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
        <SiteContext.Provider value={{ config, nav, openApi }}>
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
              <DocumentationLayout
                nav={nav}
                navIsOpen={navIsOpen}
                setNavIsOpen={setNavIsOpen}
                meta={meta}
              >
                <MDXRemote components={components} {...mdxSource} />
              </DocumentationLayout>
            </SearchProvider>
          </AnalyticsContext.Provider>
        </SiteContext.Provider>
      </VersionContextController>
    </Intercom>
  );
}

interface PathProps extends ParsedUrlQuery {
  site: string;
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const { data }: { data: Record<string, string[][]> } = await axios.get(
    `${API_ENDPOINT}/api/v1/admin/build/paths`,
    {
      headers: { Authorization: `Bearer ${process.env.INTERNAL_SITE_BEARER_TOKEN}` },
    }
  );
  const paths = Object.entries(data).flatMap(
    ([subdomain, pathsForSubdomain]: [string, string[][]]) => {
      return pathsForSubdomain.map((pathForSubdomain) => ({
        params: { site: subdomain, slug: pathForSubdomain },
      }));
    }
  );
  return {
    paths,
    fallback: true, // TODO: Change this to true once ISR is implemented https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-true
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { site, slug } = params;
  const path = slug ? slug.join('/') : 'index';

  // TODO - get all the data (page data AND global data (metadata, openApi, config))
  const {
    data: { content, config, nav, section, meta, metaTagsForSeo, title, openApi },
  }: {
    data: {
      content: string;
      config: string;
      nav: Groups;
      section: string;
      meta: PageMetaTags;
      metaTagsForSeo: PageMetaTags;
      title: string;
      openApi?: string;
    };
  } = await axios.get(`${API_ENDPOINT}/api/v1/admin/build/static-props`, {
    headers: { Authorization: `Bearer ${process.env.INTERNAL_SITE_BEARER_TOKEN}` },
    data: {
      subdomain: site,
      path,
    },
  });

  const mdxSource = await getMdxSource(content, { section, meta });
  return {
    props: {
      stringifiedMdxSource: JSON.stringify(mdxSource),
      stringifiedData: stringify({
        nav,
        meta,
        section,
        metaTagsForSeo,
        title,
        config,
        openApi,
      }),
    },
  };
};
