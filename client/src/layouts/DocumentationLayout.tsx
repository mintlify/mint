import { useRouter } from 'next/router';
import { ReactNode } from 'react';

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
