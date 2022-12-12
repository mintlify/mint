import { ReactNode, useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { SidebarLayout } from '@/layouts/NavSidebar';
import { Groups, PageMetaTags } from '@/types/metadata';
import { Header } from '@/ui/Header';
import { Title } from '@/ui/Title';
import { getSectionTitle } from '@/utils/paths/getSectionTitle';
import { slugToTitle } from '@/utils/titleText/slugToTitle';

export function DocumentationLayout({
  navIsOpen,
  setNavIsOpen,
  meta,
  children,
  nav,
}: {
  navIsOpen: boolean;
  setNavIsOpen: any;
  meta: PageMetaTags;
  children: ReactNode;
  nav: Groups;
}) {
  const currentPath = useCurrentPath();
  const { setSelectedVersion } = useContext(VersionContext);
  const { config } = useContext(ConfigContext);
  if (meta.version) {
    setSelectedVersion(meta.version);
  }

  const title = meta.sidebarTitle || meta.title || slugToTitle(meta.href || '');

  return (
    <>
      <Header
        hasNav={Boolean(config?.navigation?.length)}
        navIsOpen={navIsOpen}
        onNavToggle={(isOpen: boolean) => setNavIsOpen(isOpen)}
        title={meta?.title}
        section={getSectionTitle(currentPath, config?.navigation ?? [])}
      />
      <Title suffix={currentPath === '/' ? '' : config?.name ?? ''}>{title}</Title>
      <SidebarLayout nav={nav} navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen} meta={meta}>
        {children}
      </SidebarLayout>
    </>
  );
}
