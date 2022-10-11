import { config, Navigation } from '@/config';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';

const getFirstPage = (nav: Navigation | string): string | void => {
  if (typeof nav === 'string') {
    return nav;
  } else if (typeof nav !== 'string' && nav.group && nav.pages) {
    return getFirstPage(nav.pages[0]);
  }
};

export default function Index() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: `/${(config?.navigation && getFirstPage(config.navigation[0])) || ''}`,
      permanent: false,
    },
  };
}

Index.layoutProps = {
  meta: {
    title: 'Introduction',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
};
