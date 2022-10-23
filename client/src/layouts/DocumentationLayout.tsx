import { useRouter } from 'next/router';
import { ReactNode, useContext } from 'react';

import SiteContext from '@/context/SiteContext';
import { VersionContext } from '@/context/VersionContext';
import { SidebarLayout } from '@/layouts/SidebarLayout';
import { documentationNav, PageMetaTags } from '@/types/metadata';
import { Title } from '@/ui/Title';

export function DocumentationLayout({
  navIsOpen,
  setNavIsOpen,
  meta,
  children,
}: {
  navIsOpen: boolean;
  setNavIsOpen: any;
  meta: PageMetaTags;
  children: ReactNode;
}) {
  const router = useRouter();
  const { setSelectedVersion } = useContext(VersionContext);
  const { config } = useContext(SiteContext);
  if (meta.version) {
    setSelectedVersion(meta.version);
  }

  const title = meta.sidebarTitle || meta.title;

  return (
    <>
      <Title suffix={router.pathname === '/' ? '' : config?.name ?? ''}>{title}</Title>
      <SidebarLayout nav={documentationNav} navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen}>
        {children}
      </SidebarLayout>
    </>
  );
}
