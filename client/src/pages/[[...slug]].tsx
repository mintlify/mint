import { ResizeObserver } from '@juggle/resize-observer';
import { stringify } from 'flatted';
import 'focus-visible';
import 'intersection-observer';
import type { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import type { ParsedUrlQuery } from 'querystring';

import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { PageProps } from '@/types/page';
import Page from '@/ui/Page';
import { getPaths } from '@/utils/local/getPaths';
import getMdxSource from '@/utils/mdx/getMdxSource';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}

interface PathProps extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const files = await getPaths(path.join('content'));
  console.log(files);
  return {
    paths: [
      {
        params: {
          slug: ['getting-started'],
        },
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { slug } = params;
  const path = slug ? slug.join('/') : 'index';

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
  } = {
    content:
      '## 반가워요 👋\n\n안녕하세요 당근마켓 미니앱팀이에요. 당근미니에 관심을 두시고 방문해주신 여러분께 먼저 환영의 인사를 보내고 싶어요! 지금부터 당근미니를 만드는 방법을 하나하나 설명드릴게요\n\n## 당근미니란?\n\n당근미니는 설치 없이 당근마켓에서 바로 사용할 수 있는 웹 기반의 프로그램이에요.\n\n## [당근미니 콘솔](https://console.karrotmini.com/)이란?\n\n여러분들이 WebApp으로 만든 제품을 당근마켓 유저들에게 공개하기 위해 필요한 모든 것을 제공하는 공간이에요.\n',
    stringifiedConfig:
      '{"name":"Karrotmini","logo":{"light":"https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/logo.svg","dark":"https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/logo.svg","href":"https://www.daangn.com/"},"favicon":"/logo.svg","colors":{"primary":"#FF7E36","light":"#F09F6D","dark":"#E8661D","ultraLight":"#F5BFA1","ultraDark":"#D25006"},"modeToggle":{"default":"light","isHidden":true},"api":{"baseUrl":"https://mini.kr.karrotmarket.com","auth":{"method":"key","name":"X-API-KEY"}},"anchors":[{"name":"API Reference","icon":"rectangle-terminal","url":"api-reference"},{"name":"GitHub","icon":"github","url":"https://github.com/daangn/create-karrotmini"}],"footerSocials":{"github":"https://github.com/daangn","website":"https://www.daangn.com/","facebook":"https://www.facebook.com/daangn","instagram":"https://www.instagram.com/daangnmarket/"},"navigation":[{"group":"Documentation","pages":["getting-started","javascript-sdk","server-to-server-api-guide","design-guide","home-feed-guide","local-preview-for-dev"]},{"group":"홈 피드","pages":["api-reference/home-feeds/contents","api-reference/home-feeds/items"]},{"group":"미니앱","pages":["api-reference/miniapps/deeplinks"]},{"group":"결제","pages":["api-reference/payments/by-period","api-reference/payments/by-id","api-reference/payments/cancel"]},{"group":"지역","pages":["api-reference/regions/by-coordinates","api-reference/regions/by-ids","api-reference/regions/neighbor"]}],"__injected":{"analytics":{}}}',
    nav: [
      {
        group: 'Documentation',
        pages: [
          {
            title: 'Welcome to 당근미니 콘솔!',
            href: '/getting-started',
          },
          {
            title: '당근미니 JavaScript SDK',
            href: '/javascript-sdk',
          },
          {
            title: 'Server to Server API 사용하기',
            href: '/server-to-server-api-guide',
          },
          {
            title: '디자인 가이드',
            href: '/design-guide',
          },
          {
            title: '홈 피드 200% 활용하기',
            href: '/home-feed-guide',
          },
          {
            title: '어떻게 동작할지 보면서 개발하기',
            href: '/local-preview-for-dev',
          },
        ],
      },
      {
        group: '홈 피드',
        pages: [
          {
            title: '홈 피드에 발행할 컨텐츠를 등록해요',
            description:
              '등록된 컨텐츠는 홈피드 컨텐츠 발행 API를 이용하여 여러 유저에게 발행할 수 있어요 Request 시 home_feed_contents[].id 값을 넣어도 해당 값은 무시되고, 서버에서 생성한 값을 반환해요 Requset로 온 home_feed_contents의 순서가 Response에도 유지되는 것을 보장해요',
            openapi: 'POST /api/v1/home-feeds/contents',
            href: '/api-reference/home-feeds/contents',
          },
          {
            title: '홈 피드 컨텐츠를 발행해요',
            api: 'POST /api/v1/home-feeds/items',
            href: '/api-reference/home-feeds/items',
          },
        ],
      },
      {
        group: '미니앱',
        pages: [
          {
            title: '미니앱 내 상세 페이지로 이동할 수 있는 딥링크를 생성해요',
            openapi: 'POST /api/v1/miniapps/deeplinks',
            href: '/api-reference/miniapps/deeplinks',
          },
        ],
      },
      {
        group: '결제',
        pages: [
          {
            title: '기간으로 결제 내역을 조회해요',
            description: '조회 범위 조건: start_time_ms <= 결제내역 생성 시각 <= end_time_ms',
            openapi: 'GET /api/v1/payments/transactions',
            href: '/api-reference/payments/by-period',
          },
          {
            title: '단건 결제 내역을 조회해요',
            openapi: 'GET /api/v1/payments/transactions/{transaction_id}',
            href: '/api-reference/payments/by-id',
          },
          {
            title: '결제 내역을 취소해요',
            openapi: 'POST /api/v1/payments/transactions/{transaction_id}/cancel',
            href: '/api-reference/payments/cancel',
          },
        ],
      },
      {
        group: '지역',
        pages: [
          {
            title: '지역 ID 목록으로 지역 정보를 조회해요',
            openapi: 'GET /api/v1/regions/by-ids',
            href: '/api-reference/regions/by-ids',
          },
          {
            title: '지역 ID로 주변 지역 정보를 조회해요',
            openapi: 'GET /api/v1/regions/{region_id}/neighbor',
            href: '/api-reference/regions/neighbor',
          },
        ],
      },
    ],
    stringifiedOpenApi: '{"files":[]}',
    section: 'Documentation',
    meta: {
      title: 'Welcome to 당근미니 콘솔!',
      href: '/getting-started',
    },
    metaTagsForSeo: {
      title: 'Welcome to 당근미니 콘솔!',
    },
    favicons: {
      icons: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: 'https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/_generated/favicon/apple-touch-icon.png?v=3',
          type: 'image/png',
        },
        {
          rel: 'icon',
          sizes: '32x32',
          href: 'https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/_generated/favicon/favicon-32x32.png?v=3',
          type: 'image/png',
        },
        {
          rel: 'icon',
          sizes: '16x16',
          href: 'https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/_generated/favicon/favicon-16x16.png?v=3',
          type: 'image/png',
        },
        {
          rel: 'shortcut icon',
          href: 'https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/_generated/favicon/favicon.ico?v=3',
          type: 'image/x-icon',
        },
      ],
      browserconfig:
        'https://mintlify.s3-us-west-1.amazonaws.com/karrotmini/_generated/favicon/browserconfig.xml?v=3',
    },
  };
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
      subdomain: process.env.SUBDOMAIN ?? '',
    },
    revalidate: 60,
  };
};

export default Page;
