import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import SupremePageLayout from '@/layouts/SupremePageLayout';
import { getPage } from '@/lib/page';
import { getPaths } from '@/lib/paths';
import { ErrorPage } from '@/pages/404';
import type { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { OpenApiFile } from '@/types/openApi';
import getMdxSource from '@/utils/mdx/getMdxSource';
import { pickRedirect } from '@/utils/staticProps/pickRedirect';
import { prepareToSerialize } from '@/utils/staticProps/prepareToSerialize';

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
  openApiFiles?: OpenApiFile[];
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

  if (status === 308) {
    const { navWithMetadata }: { navWithMetadata: Groups } = data;
    if (Array.isArray(navWithMetadata) && navWithMetadata.length > 0) {
      const redirect = pickRedirect(navWithMetadata, path);
      if (redirect) {
        return redirect;
      }
    }

    console.warn('Could not find a page to redirect to.');
    return {
      notFound: true,
    };
  }

  // The server providing data to static props only sends 404s when there is no data at all
  // for the subdomain. Most not found pages are the result of broken mint.json files
  // preventing the 308 redirect above from finding a page to redirect to.
  if (status === 404) {
    return {
      notFound: true,
    };
  }

  if (status === 200) {
    let {
      content,
      mintConfig,
      navWithMetadata,
      pageMetadata,
      openApiFiles,
      favicons,
    }: {
      content: string;
      mintConfig: Config;
      navWithMetadata: Groups;
      pageMetadata: PageMetaTags;
      openApiFiles?: OpenApiFile[];
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
      props: prepareToSerialize({
        mdxSource,
        pageData: {
          navWithMetadata,
          pageMetadata,
          mintConfig,
          openApiFiles,
        },
        favicons,
        subdomain,
      }),
    };
  }
  return {
    notFound: true,
  };
};
