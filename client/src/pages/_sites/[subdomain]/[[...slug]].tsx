import { ResizeObserver } from '@juggle/resize-observer';
import * as Sentry from '@sentry/nextjs';
import { stringify } from 'flatted';
import 'focus-visible';
import 'intersection-observer';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { getPage } from '@/lib/page';
import { getPaths } from '@/lib/paths';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { PageProps } from '@/types/page';
import Page from '@/ui/Page';
import getMdxSource from '@/utils/mdx/getMdxSource';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
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
      stringifiedOpenApi,
      favicons,
    }: {
      content: string;
      stringifiedConfig: string;
      nav: Groups;
      section: string;
      meta: PageMetaTags;
      metaTagsForSeo: PageMetaTags;
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
      mdxSource = await getMdxSource(
        '🚧 A parsing error occured. Please contact the owner of this website. They can use the Mintlify CLI to test this website locally and see the errors that occur.',
        { section, meta }
      ); // placeholder content for when there is a syntax error.
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
          stringifiedConfig,
          stringifiedOpenApi,
        }),
        stringifiedFavicons: stringify(favicons),
        subdomain,
      },
      revalidate: 60,
    };
  }
  return {
    notFound: true,
  };
};

export default Page;
