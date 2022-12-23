import fs from 'fs';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { join } from 'path';
import type { ParsedUrlQuery } from 'querystring';

import type { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { OpenApiFile } from '@/types/openApi';
import { PageProps } from '@/types/page';
import Page from '@/ui/Page';
import { getPaths } from '@/utils/local/getPaths';
import getMdxSource from '@/utils/mdx/getMdxSource';
import { prepareToSerialize } from '@/utils/staticProps/prepareToSerialize';

interface PathProps extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const files = await getPaths(join('content'));
  console.log(files);
  return {
    paths: [
      {
        params: {
          slug: ['quickstart'],
        },
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps, PathProps> = async ({ params }) => {
  if (!params) throw new Error('No path parameters found');

  const { slug } = params;
  const path = slug ? slug.join('/') : 'index'; // TODO index logic
  // TODO: look for md
  // error handling
  // const markdownWithMeta = fs.readFileSync(join('content', path + '.mdx'), 'utf-8');
  // console.log(markdownWithMeta);
  const {
    content,
    mintConfig,
    navWithMetadata,
    pageMetadata,
    openApiFiles,
  }: {
    content: string;
    mintConfig: Config;
    navWithMetadata: Groups;
    pageMetadata: PageMetaTags;
    openApiFiles?: OpenApiFile[];
  } = {
    content:
      '![Hero Image](https://mintlify.s3-us-west-1.amazonaws.com/mintlify/img/hero.png)\n\n## Basic Configuration\n\nEvery Mintlify site needs a `mint.json` file with the core configuration settings added. You can learn more about the structure of the config file at [global settings guide](/settings/customization).\n\n## Deployments\n\nOnce the files are ready for deployment, you can choose to host your docs from your source control provider. Follow one of the following guides to set up deployment.\n\n<Tabs>\n  <Tab title="GitHub Setup Guide">\n    ### Open a Public Repo\n\n    Create a public repo where you would like to host the documentation.\n\n    <Tip>\n      You can also use a private repo but it prevents users from suggesting changes\n      and raising issues.\n    </Tip>\n\n    ## Add Files\n\n    The onboarding team will provide a zip file with the contents of the documentation. Unzip the file and add the contents into a `/docs` directory of the repo.\n\n    The result should look something like this.\n\n    <img className="rounded" src="https://mintlify.s3-us-west-1.amazonaws.com/mintlify/img/docs-repo.png" />\n\n    ## Install the GitHub Bot\n\n    Install the Mintlify GitHub Bot using request link provided by the onboarding team. Make sure it\'s granted access to the repo with the documentation.\n\n    Now, when you make changes to the docs and push them to the main branch, it will automatically deploy to your documentation page!\n  </Tab>\n\n  <Tab title="GitLab Setup Guide">\n    ### Generate a GitLab access token\n\n    You can use a [Personal Access Tokens](https://gitlab.com/-/profile/personal_access_tokens) if you are on GitLab\'s free tier or a Project Access Token if you are on their paid tier.\n\n    The token needs `read_api` and `read_repository` permissions. We recommend setting an expiration at least one year in the future.\n\n    <img className="rounded" src="https://mintlify.s3-us-west-1.amazonaws.com/mintlify/img/token-permissions.png" />\n\n    ### Get your Project ID from your project\'s home page\n\n    <img className="rounded" src="https://mintlify.s3-us-west-1.amazonaws.com/mintlify/img/project-id.png" />\n\n    ### Send us your details\n\n    We need your `accessToken`, `projectId`, and `deployBranch`.\n\n    Please use [Password Link](https://password.link/) to send the information securely. You don\'t need an account to use Password Link\n\n    ### Create a GitLab webhook\n\n    On your project page go to Settings > Webhooks. Enter `https://server.mintlify.com/api/v1/sites/deploys/gitlab-listener` as the webhook URL. Enter your bearer token as the secret. Make the trigger run on push events to your deploy branch, likely "main" or "master" depending on your repository.\n  </Tab>\n</Tabs>\n',
    mintConfig: {
      api: {
        auth: {},
      },
      modeToggle: {},
      colors: {
        background: {},
        primary: '#2AB673',
        light: '#55D799',
        dark: '#117866',
        ultraLight: '#CCEFE9',
        ultraDark: '#0D5E4F',
        anchors: {
          from: '#117866',
          to: '#2AB673',
        },
      },
      topbarCtaButton: {
        name: 'Request Access',
        url: 'https://mintlify.com/start',
      },
      topAnchor: {},
      classes: {},
      analytics: {
        amplitude: {},
        fathom: {
          siteId: 'YSVUHCAK',
        },
        ga4: {},
        gtm: {},
        logrocket: {},
        hotjar: {},
        mixpanel: {},
        pirsch: {},
        posthog: {},
        plausible: {},
      },
      integrations: {},
      __injected: {
        analytics: {
          amplitude: {},
          fathom: {},
          ga4: {},
          gtm: {},
          logrocket: {},
          hotjar: {},
          mixpanel: {},
          pirsch: {},
          posthog: {},
          plausible: {},
        },
      },
      versions: [],
      name: 'Mintlify',
      logo: {
        light: 'https://mintlify.s3-us-west-1.amazonaws.com/mintlify/logo/light.svg',
        dark: 'https://mintlify.s3-us-west-1.amazonaws.com/mintlify/logo/dark.svg',
        href: 'https://mintlify.com',
      },
      favicon: '/favicon.svg',
      topbarLinks: [
        {
          url: 'https://mintlify.com/community',
          name: 'Community',
          _id: '63a4c09821e279d02eee463d',
        },
      ],
      anchors: [
        {
          name: 'Showcase',
          url: 'https://mintlify.com/showcase',
          icon: 'trophy-star',
          _id: '63a4c09821e279d02eee463a',
        },
        {
          name: 'Community',
          url: 'https://mintlify.com/community',
          icon: 'discord',
          _id: '63a4c09821e279d02eee463b',
        },
        {
          name: 'GitHub',
          url: 'https://github.com/mintlify/mint',
          icon: 'github',
          _id: '63a4c09821e279d02eee463c',
        },
      ],
      navigation: [
        {
          group: 'Getting Started',
          pages: ['quickstart', 'development'],
        },
        {
          group: 'Settings',
          pages: [
            'settings/customization',
            'settings/page',
            'settings/versioning',
            'settings/subdirectory-hosting',
            'settings/seo',
          ],
        },
        {
          group: 'Components',
          pages: [
            'components/overview',
            'components/text',
            'components/image',
            'components/list',
            'components/code',
            'components/callout',
            'components/embed',
            'components/table',
          ],
        },
        {
          group: 'Advanced Components',
          pages: [
            'components/advanced/accordion',
            'components/advanced/card',
            'components/advanced/frame',
            'components/advanced/tabs',
            'components/advanced/tooltip',
          ],
        },
        {
          group: 'API Components',
          pages: [
            'api-components/overview',
            'api-components/param',
            'api-components/response',
            'api-components/expandable',
            'api-components/examples',
            'api-components/openapi',
          ],
        },
        {
          group: 'Analytics',
          pages: [
            'site-stats/supported-integrations',
            {
              group: 'Set Up Analytics',
              pages: [
                'site-stats/set-up/amplitude',
                'site-stats/set-up/fathom',
                'site-stats/set-up/google-analytics',
                'site-stats/set-up/google-tag-manager',
                'site-stats/set-up/hotjar',
                'site-stats/set-up/logrocket',
                'site-stats/set-up/mixpanel',
                'site-stats/set-up/pirsch',
                'site-stats/set-up/posthog',
              ],
            },
          ],
        },
      ],
      footerSocials: {
        github: 'https://github.com/mintlify',
        discord: 'https://discord.gg/MPNgtSZkgK',
        twitter: 'https://twitter.com/mintlify',
      },
    },
    navWithMetadata: [
      {
        group: 'Getting Started',
        pages: [
          {
            title: 'Quickstart',
            description: 'Build beautiful documentation that converts users',
            href: '/quickstart',
          },
          {
            title: 'Development',
            description: 'Run Mintlify on your computer to see changes locally',
            href: '/development',
          },
        ],
      },
      {
        group: 'Settings',
        pages: [
          {
            title: 'Global Settings (mint.json)',
            description:
              'Mintlify gives you complete control over the look and feel of your documentation using the mint.json file',
            href: '/settings/customization',
          },
          {
            title: 'Page Titles and Metadata',
            description: 'Metadata is important for API pages and SEO optimization.',
            href: '/settings/page',
          },
          {
            title: 'Versioning',
            description:
              'Optionally, you can have separate versions for your docs. Mintlify lets you toggle content based on your docs version.',
            href: '/settings/versioning',
          },
          {
            title: 'Subdirectory Hosting',
            description: null,
            href: '/settings/subdirectory-hosting',
          },
          {
            title: 'Search Engine Optimization',
            description:
              'Mintlify automatically generates most meta tags. If you want to customize them, you can set default values in mint.json or change them per page.',
            href: '/settings/seo',
          },
        ],
      },
      {
        group: 'Components',
        pages: [
          {
            title: 'Writing Content',
            description: 'How components work',
            href: '/components/overview',
          },
          {
            title: 'Rich Text',
            description: 'Text, title, and styling in standard markdown',
            href: '/components/text',
          },
          {
            title: 'Images',
            description: 'Create images using markdown or embeds',
            href: '/components/image',
          },
          {
            title: 'Lists',
            description: 'Create ordered and unordered lists',
            href: '/components/list',
          },
          {
            title: 'Code Blocks',
            description: 'Display inline code and code blocks',
            href: '/components/code',
          },
          {
            title: 'Callout Boxes',
            description: 'Use callouts to create add eye-catching context to your content',
            href: '/components/callout',
          },
          {
            title: 'Custom Embeds',
            description: 'Images, videos, and any HTML elements',
            href: '/components/embed',
          },
          {
            title: 'Tables',
            description: 'Display an arrangement of data in rows and columns',
            href: '/components/table',
          },
        ],
      },
      {
        group: 'Advanced Components',
        pages: [
          {
            title: 'Accordions',
            description: 'Using the Accordion component',
            href: '/components/advanced/accordion',
          },
          {
            title: 'Cards',
            description: 'Highlight main points or links with customizable icons',
            href: '/components/advanced/card',
          },
          {
            title: 'Image Container',
            description:
              'Use the Frame component to wrap images or other components in a container',
            href: '/components/advanced/frame',
          },
          {
            title: 'Tabs',
            description: 'Toggle content using the Tabs component',
            href: '/components/advanced/tabs',
          },
          {
            title: 'Tooltips',
            description: 'Show a definition when you hover over text.',
            href: '/components/advanced/tooltip',
          },
        ],
      },
      {
        group: 'API Components',
        pages: [
          {
            title: 'Playground',
            description: 'Enable users interact with your API',
            api: 'GET https://server.mintlify.com/api/v1/demo',
            hideApiMarker: true,
            href: '/api-components/overview',
          },
          {
            title: 'Parameters',
            description: 'Set path, query, and body parameters',
            href: '/api-components/param',
          },
          {
            title: 'Responses',
            description: 'Display API response values',
            href: '/api-components/response',
          },
          {
            title: 'Expand Objects',
            description: 'Toggle to display nested properties',
            href: '/api-components/expandable',
          },
          {
            title: 'API Examples',
            description: 'Display the request and response on the right sidebar',
            href: '/api-components/examples',
          },
          {
            title: 'OpenAPI Support',
            description: 'Reference OpenAPI endpoints for the API playground',
            href: '/api-components/openapi',
          },
        ],
      },
      {
        group: 'Analytics',
        pages: [
          {
            title: 'Supported Integrations',
            description: 'Mintlify integrates with a variety of analytics platforms.',
            href: '/site-stats/supported-integrations',
          },
          {
            group: 'Set Up Analytics',
            pages: [
              {
                title: 'Amplitude',
                description: null,
                href: '/site-stats/set-up/amplitude',
              },
              {
                title: 'Fathom',
                description: null,
                href: '/site-stats/set-up/fathom',
              },
              {
                title: 'Google Analytics 4',
                description: 'Also known as GA4',
                href: '/site-stats/set-up/google-analytics',
              },
              {
                title: 'Google Tag Manager',
                description: null,
                href: '/site-stats/set-up/google-tag-manager',
              },
              {
                title: 'HotJar',
                description: null,
                href: '/site-stats/set-up/hotjar',
              },
              {
                title: 'Logrocket',
                description: null,
                href: '/site-stats/set-up/logrocket',
              },
              {
                title: 'Mixpanel',
                description: null,
                href: '/site-stats/set-up/mixpanel',
              },
              {
                title: 'Pirsch',
                description: null,
                href: '/site-stats/set-up/pirsch',
              },
              {
                title: 'PostHog',
                description: null,
                href: '/site-stats/set-up/posthog',
              },
            ],
          },
        ],
      },
    ],
    openApiFiles: [],
    pageMetadata: {
      title: 'Quickstart',
      description: 'Build beautiful documentation that converts users',
      href: '/quickstart',
    },
  };
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
  const favicons: FaviconsProps = {
    icons: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicons/apple-touch-icon.png',
        type: 'image/png',
      },
      {
        rel: 'icon',
        sizes: '32x32',
        href: '/favicons/favicon-32x32.png',
        type: 'image/png',
      },
      {
        rel: 'icon',
        sizes: '16x16',
        href: '/favicons/favicon-16x16.png',
        type: 'image/png',
      },
      {
        rel: 'shortcut icon',
        href: '/favicons/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    browserconfig: '/favicons/browserconfig.xml',
  };
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
    }),
  };
};

export default Page;
