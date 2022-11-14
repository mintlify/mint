import { ResizeObserver } from '@juggle/resize-observer';
import * as Sentry from '@sentry/nextjs';
import { stringify, parse } from 'flatted';
import 'focus-visible';
import 'intersection-observer';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import SupremePageLayout from '@/layouts/SupremePageLayout';
import { getPage } from '@/lib/page';
import { getPaths } from '@/lib/paths';
import { ErrorPage } from '@/pages/404';
import type { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import getMdxSource from '@/utils/mdx/getMdxSource';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}

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

// TODO - handle incorrect urls
export default function Page({
  stringifiedMdxSource,
  stringifiedData,
  stringifiedFavicons,
  subdomain,
}: PageProps) {
  try {
    const mdxSource = parse(stringifiedMdxSource);
    const parsedData = parse(stringifiedData) as ParsedDataProps;
    const config = JSON.parse(parsedData.stringifiedConfig) as Config;
    const openApi = parsedData.stringifiedOpenApi ? JSON.parse(parsedData.stringifiedOpenApi) : {};
    const favicons = parse(stringifiedFavicons);
    return (
      <SupremePageLayout
        mdxSource={mdxSource}
        parsedData={parsedData}
        config={config}
        openApi={openApi}
        favicons={favicons}
        subdomain={subdomain}
      />
    );
  } catch (e) {
    return <ErrorPage />;
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
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { subdomain, slug } = params;
  console.log(slug);
  const path = slug ? slug.join('/') : 'index';

  Sentry.setContext('site', {
    subdomain,
    slug,
  });

  // The entire build will fail when data is undefined
  const { data, status } = await getPage(subdomain, path);
  if (data == null) {
    Sentry.captureException('Page data is missing');
    return {
      notFound: true,
    };
  }

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
      const response = await getMdxSource(content, {
        section,
        meta,
      });
      mdxSource = response;
    } catch (err) {
      mdxSource = await getMdxSource('🚧 Content under construction', { section, meta }); // placeholder content for when there is a syntax error.
      console.log(`⚠️ Warning: MDX failed to parse page ${path}: `, err);
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
