import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { SidebarLayout } from '@/layouts/SidebarLayout';
import { Groups, PageMetaTags } from '@/types/metadata';
import { Title } from '@/ui/Title';
import { getCurrentAnchorVersion } from '@/utils/getCurrentAnchor';

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
  const router = useRouter();
  const { setSelectedVersion } = useContext(VersionContext);
  const { config } = useContext(ConfigContext);
  if (meta.version) {
    setSelectedVersion(meta.version);
  }

  const title = meta.sidebarTitle || meta.title;

  return (
    <>
      <Title suffix={router.pathname === '/' ? '' : config?.name ?? ''}>{title}</Title>
      <SidebarLayout nav={nav} navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen}>
        {children}
      </SidebarLayout>
    </>
  );
}
