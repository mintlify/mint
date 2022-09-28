import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { config } from '@/config';
import { SidebarLayout } from '@/layouts/SidebarLayout';
import { documentationNav } from '@/nav';
import { Title } from '@/ui/Title';
import { slugToTitle } from '@/utils/slugToTitle';

export function DocumentationLayout({
  isMdx,
  navIsOpen,
  setNavIsOpen,
  meta,
  slug,
  children,
}: {
  isMdx: boolean;
  navIsOpen: boolean;
  setNavIsOpen: any;
  meta: any;
  slug?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  if (!isMdx) {
    return <>{children}</>;
  }

  const defaultTitle = slugToTitle(router.pathname);

  return (
    <>
      <Title suffix={router.pathname === '/' ? '' : config.name}>
        {meta.sidebarTitle || meta.title || defaultTitle}
      </Title>
      <SidebarLayout nav={documentationNav} navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen}>
        {children}
      </SidebarLayout>
    </>
  );
}
