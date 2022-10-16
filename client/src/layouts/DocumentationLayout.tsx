import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { config } from '@/config';
import { SidebarLayout } from '@/layouts/SidebarLayout';
import { documentationNav } from '@/metadata';
import { Title } from '@/ui/Title';

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
