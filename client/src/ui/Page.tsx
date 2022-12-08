import { parse } from 'flatted';

import SupremePageLayout from '@/layouts/SupremePageLayout';
import { ErrorPage } from '@/pages/404';
import { Config } from '@/types/config';
import { PageProps, ParsedDataProps } from '@/types/page';

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
        subdomain={subdomain ?? ''}
      />
    );
  } catch (e) {
    return <ErrorPage />;
  }
}
