import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import isAbsoluteUrl from 'is-absolute-url';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useContext } from 'react';
import { createContext, forwardRef, useRef, useState } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { useColors } from '@/hooks/useColors';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { PageMetaTags, Group, Groups, GroupPage, isGroup } from '@/types/metadata';
import Icon from '@/ui/Icon';
import { extractMethodAndEndpoint } from '@/utils/api';
import { getAnchorsToDisplay } from '@/utils/getAnchorsToDisplay';
import { getGroupsInDivision, getGroupsInVersion, getGroupsNotInDivision } from '@/utils/nav';
import { isPathInGroupPages } from '@/utils/nav';
import { getMethodDotsColor } from '@/utils/openApiColors';

import { Anchor, findFirstNavigationEntry, Navigation } from '../types/config';
import { StyledTopLevelLink, TopLevelLink } from '../ui/TopLevelLink';

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

const getPaddingByLevel = (level: number) => {
  switch (level) {
    case 0:
      return 'pl-4';
    case 1:
      return 'pl-7';
    default:
      return 'pl-10';
  }
};

const NavItem = forwardRef(
  ({ groupPage, level = 0 }: { groupPage: GroupPage | undefined; level?: number }, ref: any) => {
    const router = useRouter();
    const { config } = useContext(ConfigContext);

    if (groupPage == null) {
      return null;
    }

    if (isGroup(groupPage)) {
      return <GroupDropdown group={groupPage} level={level} />;
    }

    const { href, api: pageApi, openapi } = groupPage;

    const isActive = groupPage.href === router.asPath;
    const api = pageApi || openapi;
    const title = groupPage.sidebarTitle || groupPage.title;

    return (
      <li ref={ref}>
        <Link href={href || '/'}>
          <a
            className={clsx(
              'flex border-l -ml-px',
              isActive
                ? 'text-primary border-current font-semibold dark:text-primary-light'
                : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
              getPaddingByLevel(level),
              config?.classes?.navigationItem
            )}
          >
            {api && (
              <div
                className={clsx('mt-[0.5rem] mr-2 h-2 w-2 rounded-sm', {
                  'bg-primary dark:bg-primary-light': isActive,
                  [getMethodDotsColor(extractMethodAndEndpoint(api).method)]: !isActive,
                })}
              />
            )}
            <div className="flex-1">{title}</div>
          </a>
        </Link>
      </li>
    );
  }
);

const GroupDropdown = ({ group, level }: { group: Group; level: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { group: name, pages } = group;

  if (!name || !pages) {
    return null;
  }

  const onClick = () => {
    // Do not navigate if:
    // 1. closing
    // 2. The first link is another nested menu
    // 3. The current page is in the nested pages being exposed
    if (
      !isOpen &&
      !isGroup(pages[0]) &&
      pages[0]?.href &&
      !isPathInGroupPages(router.pathname, pages)
    ) {
      // Navigate to the first page if it exists
      router.push(pages[0].href);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <span
        className={clsx(
          'group flex items-center border-l -ml-px cursor-pointer space-x-3 border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
          getPaddingByLevel(level)
        )}
        onClick={onClick}
      >
        <div>{name}</div>
        <svg
          width="3"
          height="24"
          viewBox="0 -9 3 24"
          className={clsx(
            'text-slate-400 overflow-visible group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500',
            isOpen && 'rotate-90'
          )}
        >
          <path
            d="M0 0L3 3L0 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          ></path>
        </svg>
      </span>
      {isOpen &&
        pages.map((subpage: GroupPage) => <NavItem groupPage={subpage} level={level + 1} />)}
    </>
  );
};

function nearestScrollableContainer(el: any) {
  function isScrollable(el: Element) {
    const style = window.getComputedStyle(el);
    const overflowX = style['overflowX'];
    const overflowY = style['overflowY'];
    const canScrollY = el.clientHeight < el.scrollHeight;
    const canScrollX = el.clientWidth < el.scrollWidth;

    const isScrollableY = canScrollY && (overflowY === 'auto' || overflowY === 'scroll');
    const isScrollableX = canScrollX && (overflowX === 'auto' || overflowX === 'scroll');

    return isScrollableY || isScrollableX;
  }

  while (el && el !== document.body && isScrollable(el) === false) {
    el = el.parentNode || el.host;
  }

  return el;
}

function Nav({ nav, children, mobile = false }: any) {
  const router = useRouter();
  const { config } = useContext(ConfigContext);
  const activeItemRef: any = useRef();
  const previousActiveItemRef: any = useRef();
  const scrollRef: any = useRef();

  let numPages = 0;
  if (nav) {
    nav.forEach((group: { group: string; pages: string[] }) => {
      numPages += group.pages.length;
    });
  }

  useIsomorphicLayoutEffect(() => {
    function updatePreviousRef() {
      previousActiveItemRef.current = activeItemRef.current;
    }

    if (activeItemRef.current) {
      if (activeItemRef.current === previousActiveItemRef.current) {
        updatePreviousRef();
        return;
      }

      updatePreviousRef();

      const scrollable = nearestScrollableContainer(scrollRef.current);

      const scrollRect = scrollable.getBoundingClientRect();
      const activeItemRect = activeItemRef.current.getBoundingClientRect();

      const top = activeItemRef.current.offsetTop;
      const bottom = top - scrollRect.height + activeItemRect.height;

      if (scrollable.scrollTop > top || scrollable.scrollTop < bottom) {
        scrollable.scrollTop = top - scrollRect.height / 2 + activeItemRect.height / 2;
      }
    }
  }, [router.pathname]);

  return (
    <nav ref={scrollRef} id="nav" className="lg:text-sm lg:leading-6 relative">
      <div className="sticky top-0 -ml-0.5 pointer-events-none">
        {!mobile && (
          <div
            className={clsx(
              'h-8',
              config?.backgroundImage == null &&
                'bg-gradient-to-b from-background-light dark:from-background-dark'
            )}
          />
        )}
      </div>
      <ul>
        {config?.anchors != null && config.anchors.length > 0 && <TopLevelNav mobile={mobile} />}
        {children}
        {nav &&
          numPages > 0 &&
          nav
            .map(({ group, pages }: { group: string; pages: PageMetaTags[] }, i: number) => {
              return (
                <li
                  key={i}
                  className={clsx({
                    'mt-12 lg:mt-8': !Boolean(
                      i === 0 && (config?.anchors == null || config.anchors?.length === 0)
                    ),
                  })}
                >
                  <h5 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                    {group}
                  </h5>
                  <ul
                    className={clsx(
                      'space-y-6 lg:space-y-2 border-l border-slate-100',
                      mobile ? 'dark:border-slate-700' : 'dark:border-slate-800'
                    )}
                  >
                    {pages.map((page, i: number) => {
                      return <NavItem key={i} groupPage={page} />;
                    })}
                  </ul>
                </li>
              );
            })
            .filter(Boolean)}
      </ul>
    </nav>
  );
}

function TopLevelNav({ mobile }: { mobile: boolean }) {
  let { pathname } = useRouter();
  const { config } = useContext(ConfigContext);
  const { selectedVersion } = useContext(VersionContext);
  const colors = useColors();

  const isRootAnchorActive =
    pathname.startsWith('/') &&
    !config?.anchors?.some((anchor: Anchor) => pathname.startsWith(`/${anchor.url}`));
  return (
    <>
      <TopLevelLink
        mobile={mobile}
        href="/"
        key="/"
        isActive={isRootAnchorActive}
        className="mb-4"
        shadow="group-hover:shadow-primary-ultralight dark:group-hover:bg-primary"
        color={colors.anchors[0]}
        icon={
          <Icon
            icon="book-open"
            iconType="duotone"
            className={clsx(
              `h-4 w-4 bg-white secondary-opacity group-hover:fill-primary-dark dark:group-hover:bg-white`,
              isRootAnchorActive ? 'dark:bg-white' : 'dark:bg-slate-500'
            )}
          />
        }
      >
        {config?.topAnchor?.name ?? 'Documentation'}
      </TopLevelLink>
      {config?.anchors &&
        getAnchorsToDisplay(config.anchors, selectedVersion, pathname).map(
          (anchor: Anchor, i: number) => {
            const isAbsolute = isAbsoluteUrl(anchor.url);
            let href;
            if (isAbsolute) {
              href = anchor.url;
            } else {
              config.navigation?.every((nav: Navigation) => {
                const page = findFirstNavigationEntry(nav, `${anchor.url}/`);
                if (page) {
                  if (typeof page === 'string') {
                    href = `/${page}`;
                  } else {
                    href = `/${page.pages[0]}`;
                  }
                  return false;
                }
                return true;
              });
            }

            return (
              <StyledTopLevelLink
                key={href}
                mobile={mobile}
                href={href || '/'}
                name={anchor?.name}
                icon={anchor?.icon}
                color={colors.anchors[i + 1]}
                isActive={pathname.startsWith(`/${anchor.url}`)}
              />
            );
          }
        )}
    </>
  );
}

function Wrapper({
  allowOverflow,
  children,
}: {
  allowOverflow: boolean;
  children: React.ReactChild;
}) {
  return <div className={allowOverflow ? undefined : 'overflow-hidden'}>{children}</div>;
}

// TODO: Set remaining types
export function SidebarLayout({
  navIsOpen,
  setNavIsOpen,
  nav,
  layoutProps: { allowOverflow = true } = {},
  children,
}: {
  navIsOpen: boolean;
  setNavIsOpen: any;
  nav: Groups;
  layoutProps?: any;
  children: ReactNode;
}) {
  const router = useRouter();
  const { config } = useContext(ConfigContext);
  const { selectedVersion } = useContext(VersionContext);

  const pathname = router.pathname;
  const currentDivision = config?.anchors?.find((anchor: Anchor) =>
    pathname.startsWith(`/${anchor.url}`)
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

  navForDivision = getGroupsInVersion(navForDivision, selectedVersion);

  return (
    <SidebarContext.Provider value={{ nav, navIsOpen, setNavIsOpen }}>
      <Wrapper allowOverflow={allowOverflow}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="hidden lg:block fixed z-20 top-[3.8125rem] bottom-0 left-[max(0px,calc(50%-45rem))] right-auto w-[19.5rem] pb-10 px-8 overflow-y-auto">
            <Nav nav={navForDivision} />
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
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
        <div className="relative bg-white w-80 min-h-full max-w-[calc(100%-3rem)] p-6 dark:bg-slate-800">
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
          <Nav nav={navForDivision} mobile={true} />
        </div>
      </Dialog>
    </SidebarContext.Provider>
  );
}
