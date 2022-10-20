import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { SidebarLayout } from '@/layouts/SidebarLayout';
import { config } from '@/types/config';
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
