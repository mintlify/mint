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
import { prepareToSerialize } from '@/utils/prepareToSerialize';

interface PageProps {
  mdxSource: string;
  pageData: PageDataProps;
  favicons: FaviconsProps;
  subdomain: string;
}

export interface PageDataProps {
  navWithMetadata: Groups;
  pageMetadata: PageMetaTags;
  title: string;
  mintConfig: Config;
  openApi?: any;
}

export default function Page({ mdxSource, pageData, favicons, subdomain }: PageProps) {
  try {
    return (
      <SupremePageLayout
        mdxSource={mdxSource}
        pageData={pageData}
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
  const path = slug ? slug.join('/') : 'index';

  // The entire build will fail when data is undefined
  const { data, status } = await getPage(subdomain, path);
  if (data == null) {
    console.error('Page data is missing');
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
    const redirect: { destination: string; permanent: boolean } = data;
    return { redirect };
  }
  if (status === 200) {
    const {
      content,
      mintConfig,
      navWithMetadata,
      pageMetadata,
      title,
      openApi,
      favicons,
    }: {
      content: string;
      mintConfig: string;
      navWithMetadata: Groups;
      pageMetadata: PageMetaTags;
      title: string;
      openApi?: string;
      favicons: FaviconsProps;
    } = data;
    let mdxSource: any = '';

    try {
      const response = await getMdxSource(content, {
        pageMetadata,
      });
      mdxSource = response;
    } catch (err) {
      mdxSource = await getMdxSource(
        '🚧 A parsing error occured. Please contact the owner of this website. They can use the Mintlify CLI to test this website locally and see the errors that occur.',
        { pageMetadata }
      ); // placeholder content for when there is a syntax error.
      console.log(`⚠️ Warning: MDX failed to parse page ${path}: `, err);
    }

    return {
      props: {
        mdxSource,
        pageData: prepareToSerialize({
          navWithMetadata,
          pageMetadata,
          title,
          mintConfig,
          openApi,
        }),
        favicons: prepareToSerialize(favicons),
        subdomain,
      },
    };
  }
  return {
    notFound: true,
  };
};
