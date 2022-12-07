import { Dialog } from '@headlessui/react';
import isAbsoluteUrl from 'is-absolute-url';
import { ReactNode, useContext } from 'react';
import { createContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { PageMetaTags, Groups } from '@/types/metadata';
import { getGroupsInDivision, getGroupsInVersion, getGroupsNotInDivision } from '@/utils/nav';
import { optionallyRemoveLeadingSlash } from '@/utils/paths/leadingSlashHelpers';

import { Anchor, Config } from '../../types/config';
import { Nav } from './Nav';

type SidebarContextType = {
  nav: any;
  navIsOpen: boolean;
  setNavIsOpen: (navIsOpen: boolean) => void;
};

// @ts-ignore
export const SidebarContext = createContext<SidebarContextType>({
  nav: [],
  navIsOpen: false,
  setNavIsOpen: () => {},
});

function Wrapper({
  allowOverflow,
  children,
}: {
  allowOverflow: boolean;
  children: React.ReactChild;
}) {
  return <div className={allowOverflow ? undefined : 'overflow-hidden'}>{children}</div>;
}

export function SidebarLayout({
  navIsOpen,
  setNavIsOpen,
  nav,
  layoutProps: { allowOverflow = true } = {},
  meta,
  children,
}: {
  navIsOpen: boolean;
  setNavIsOpen: any;
  nav: Groups;
  layoutProps?: any;
  meta: PageMetaTags;
  children: ReactNode;
}) {
  const { config } = useContext(ConfigContext);
  const { selectedVersion } = useContext(VersionContext);

  const navForDivision = getNavForDivision(nav, config, useCurrentPath());
  const navForDivisionInVersion = getGroupsInVersion(navForDivision, selectedVersion);

  return (
    <SidebarContext.Provider value={{ nav, navIsOpen, setNavIsOpen }}>
      <Wrapper allowOverflow={allowOverflow}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="hidden lg:block fixed z-20 top-[3.8125rem] bottom-0 left-[max(0px,calc(50%-45rem))] right-auto w-[19.5rem] pb-10 px-8 overflow-y-auto">
            <Nav nav={navForDivisionInVersion} meta={meta} />
          </div>
          <div className="lg:pl-[20rem]">{children}</div>
        </div>
      </Wrapper>
      <Dialog
        as="div"
        open={navIsOpen}
        onClose={() => setNavIsOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto lg:hidden"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-background-dark/80" />
        <div className="relative bg-white w-80 min-h-full max-w-[calc(100%-3rem)] p-6 dark:bg-background-dark">
          <button
            type="button"
            onClick={() => setNavIsOpen(false)}
            className="absolute z-10 top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <span className="sr-only">Close navigation</span>
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Nav nav={navForDivisionInVersion} meta={meta} mobile={true} />
        </div>
      </Dialog>
    </SidebarContext.Provider>
  );
}

function getNavForDivision(nav: Groups, config: Config | undefined, currentPath: string) {
  const currentPathNoLeadingSlash = optionallyRemoveLeadingSlash(currentPath);

  const currentDivision = config?.anchors?.find((anchor: Anchor) =>
    currentPathNoLeadingSlash.startsWith(anchor.url)
  );

  let navForDivision = getGroupsInDivision(nav, currentDivision?.url ? [currentDivision?.url] : []);

  if (navForDivision.length === 0) {
    // Base docs include everything NOT in an anchor
    const divisions = config?.anchors?.filter((anchor: Anchor) => !isAbsoluteUrl(anchor.url)) || [];
    navForDivision = getGroupsNotInDivision(
      nav,
      divisions.map((division: Anchor) => division.url)
    );
  }

  return navForDivision;
}
