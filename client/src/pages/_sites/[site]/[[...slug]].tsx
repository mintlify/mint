import axios from 'axios';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { ParsedUrlQuery } from 'querystring';

const API_ENDPOINT = process.env.API_ENDPOINT;

interface PageProps {
  stringifiedData: string;
}

export default function Page({ stringifiedData }: PageProps) {
  const { mdxSource } = JSON.parse(stringifiedData) as {
    mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  };

  return (
    <div>
      <MDXRemote {...mdxSource} />
    </div>
  );
}

interface PathProps extends ParsedUrlQuery {
  site: string;
  slug: string[] | undefined;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const { data }: { data: Record<string, string[][]> } = await axios.get(
    `${API_ENDPOINT}/api/v1/admin/builds/paths`,
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

  // TODO - get all the data (page data AND global data (metadata, openApi, config))
  const content = 'hello world';
  const mdxSource = await serialize(content);
  return {
    props: {
      stringifiedData: JSON.stringify({ mdxSource }),
    },
  };
};

const getMdxSource = async (pageContents: string) => {
  return serialize(pageContents);
};
