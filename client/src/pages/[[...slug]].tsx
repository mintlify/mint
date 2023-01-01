import type { GetStaticPaths, GetStaticProps } from 'next';
import { join } from 'path';
import type { ParsedUrlQuery } from 'querystring';

import { getPageProps } from '@/lib/local/page';
import { getPaths } from '@/lib/local/paths';
import type { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { OpenApiFile } from '@/types/openApi';
import { PageProps } from '@/types/page';
import { Snippet } from '@/types/snippet';
import Page from '@/ui/Page';
import createSnippetTreeMap from '@/utils/mdx/createSnippetTreeMap';
import getMdxSource from '@/utils/mdx/getMdxSource';
import { pickRedirect } from '@/utils/staticProps/pickRedirect';
import { prepareToSerialize } from '@/utils/staticProps/prepareToSerialize';

interface PathProps extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = await getPaths(join('src/_props'));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { slug } = params;
  const slugStr = slug ? slug.join('/') : 'index'; // TODO index logic

  const data = await getPageProps(slugStr);

  if (data.hasOwnProperty('notFound')) {
    // Not directly returning it for type purposes
    return {
      notFound: true,
    };
  }

  // Only returns navWithMetadata when we need to redirect
  if (data.hasOwnProperty('navWithMetadata')) {
    const { navWithMetadata } = data as {
      navWithMetadata: Groups;
    };
    if (Array.isArray(navWithMetadata) && navWithMetadata.length > 0) {
      const redirect = pickRedirect(navWithMetadata, slugStr);
      if (redirect) {
        return redirect;
      }
    }

    console.warn('Could not find a page to redirect to.');
    return {
      notFound: true,
    };
  }
  if (
    data.hasOwnProperty('content') &&
    data.hasOwnProperty('pageData') &&
    data.hasOwnProperty('favicons')
  ) {
    try {
      const { content, pageData, favicons, snippets } = data as {
        content: string;
        pageData: {
          mintConfig: Config;
          navWithMetadata: Groups;
          pageMetadata: PageMetaTags;
          openApiFiles?: OpenApiFile[];
        };
        snippets: Snippet[];
        favicons: FaviconsProps;
      };
      let mdxSource: any = '';
      const { pageMetadata } = pageData;
      const snippetTreeMap = await createSnippetTreeMap(snippets ?? []);
      try {
        const response = await getMdxSource(
          content,
          {
            pageMetadata,
          },
          snippetTreeMap
        );
        mdxSource = response;
      } catch (err) {
        mdxSource = await getMdxSource('🚧 A parsing error occured.', { pageMetadata }); // placeholder content for when there is a syntax error.
        console.log(`⚠️ Warning: MDX failed to parse page ${slugStr}: `, err);
      }
      return {
        props: prepareToSerialize({
          mdxSource,
          pageData,
          favicons,
        }),
      };
    } catch (err) {
      console.warn(err);
      return {
        notFound: true,
      };
    }
  }
  return {
    notFound: true,
  };
};

export default Page;
