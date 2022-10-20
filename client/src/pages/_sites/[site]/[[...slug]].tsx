// import axios from 'axios';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';

import components from '@/components';
import { Groups, PageMetaTags, findPageInGroup, META_TAGS_FOR_LAYOUT } from '@/types/metadata';
import getMdxSource from '@/utils/mdx/getMdxSource';

// const API_ENDPOINT = process.env.API_ENDPOINT;

interface PageProps {
  stringifiedMdxSource: string;
  stringifiedData: string;
}

interface ParsedDataProps {
  siteMetadata: Groups;
}

export default function Page({ stringifiedMdxSource, stringifiedData }: PageProps) {
  const router = useRouter();
  const mdxSource = JSON.parse(stringifiedMdxSource) as MDXRemoteSerializeResult<
    Record<string, unknown>
  >;
  const { siteMetadata } = JSON.parse(stringifiedData) as ParsedDataProps;

  let section = undefined;
  let meta: PageMetaTags = {};
  siteMetadata.forEach((group) => {
    const foundPage = findPageInGroup(group, router.pathname);
    if (foundPage) {
      section = foundPage.group;
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

  return (
    <div>
      <MDXRemote scope={{ section, meta }} components={components} {...mdxSource} />
    </div>
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
          slug: ['index'],
        },
      },
    ],
    fallback: true, // TODO: Change this to true once ISR is implemented https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-true
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { site, slug } = params;

  // TODO - get all the data (page data AND global data (metadata, openApi, config))
  const content = '## hello world';
  const mdxSource = await getMdxSource(content);
  const siteMetadata: Groups = [
    {
      group: 'Home',
      pages: [
        {
          title: 'Hello World',
          description: 'hello',
          href: 'index',
        },
      ],
    },
  ];
  console.log({ mdxSource });
  return {
    props: {
      stringifiedMdxSource: JSON.stringify(mdxSource),
      stringifiedData: JSON.stringify({ siteMetadata }),
    },
  };
};
