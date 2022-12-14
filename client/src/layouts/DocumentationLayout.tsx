import { ReactNode, useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { SidebarLayout } from '@/layouts/NavSidebar';
import { Groups, PageMetaTags } from '@/types/metadata';
import { Header } from '@/ui/Header';
import { getSectionTitle } from '@/utils/paths/getSectionTitle';

export function DocumentationLayout({
  navIsOpen,
  setNavIsOpen,
  pageMetadata,
  children,
  navWithMetadata,
}: {
  navIsOpen: boolean;
  setNavIsOpen: any;
  pageMetadata: PageMetaTags;
  children: ReactNode;
  navWithMetadata: Groups;
}) {
  const currentPath = useCurrentPath();
  const { setSelectedVersion } = useContext(VersionContext);
  const { mintConfig } = useContext(ConfigContext);

  if (pageMetadata.version) {
    setSelectedVersion(pageMetadata.version);
  }

  return (
    <>
      <Header
        hasNav={Boolean(mintConfig?.navigation?.length)}
        navIsOpen={navIsOpen}
        onNavToggle={(isOpen: boolean) => setNavIsOpen(isOpen)}
        title={pageMetadata?.title}
        section={getSectionTitle(currentPath, mintConfig?.navigation ?? [])}
      />
      <SidebarLayout
        navWithMetadata={navWithMetadata}
        navIsOpen={navIsOpen}
        setNavIsOpen={setNavIsOpen}
        pageMetadata={pageMetadata}
      >
        {children}
      </SidebarLayout>
    </>
  );
}
