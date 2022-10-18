import { useRouter } from 'next/router';
import { ReactNode, useContext } from 'react';

import { config } from '@/config';
import { VersionContext } from '@/context/VersionContext';
import { SidebarLayout } from '@/layouts/SidebarLayout';
import { config } from '@/types/config';
import { documentationNav } from '@/types/metadata';
import { Title } from '@/ui/Title';

import { Meta } from './ContentsLayout';

export function DocumentationLayout({
  navIsOpen,
  setNavIsOpen,
  meta,
  children,
}: {
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
