import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

import { config } from '@/config';
import { VersionContext } from '@/context/VersionContext';
import { SidebarLayout } from '@/layouts/SidebarLayout';
import { documentationNav } from '@/metadata';
import { Title } from '@/ui/Title';
import { getCurrentAnchorVersion } from '@/utils/getCurrentAnchor';

import { Meta } from './ContentsLayout';

export function DocumentationLayout({
  isMdx,
  navIsOpen,
  setNavIsOpen,
  meta,
  children,
}: {
  isMdx: boolean;
  navIsOpen: boolean;
  setNavIsOpen: any;
  meta: Meta;
  children: ReactNode;
}) {
  const router = useRouter();
  const { setSelectedVersion } = useContext(VersionContext);

  if (meta.version) {
    setSelectedVersion(meta.version);
  }

  if (!isMdx) {
    return <>{children}</>;
  }

  const title = meta.sidebarTitle || meta.title;

  return (
    <>
      <Title suffix={router.pathname === '/' ? '' : config.name}>{title}</Title>
      <SidebarLayout nav={documentationNav} navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen}>
        {children}
      </SidebarLayout>
    </>
  );
}
