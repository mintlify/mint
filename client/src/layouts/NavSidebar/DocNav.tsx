import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, useContext, useState } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { Group, GroupPage, isGroup, PageMetaTags } from '@/types/metadata';
import { extractMethodAndEndpoint } from '@/utils/api';
import { isPathInGroupPages } from '@/utils/nav';
import { getMethodDotsColor } from '@/utils/openApiColors';
import { isEqualIgnoringLeadingSlash } from '@/utils/paths/leadingSlashHelpers';
import { slugToTitle } from '@/utils/titleText/slugToTitle';

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
  (
    {
      groupPage,
      level = 0,
      mobile = false,
    }: { groupPage: GroupPage | undefined; level?: number; mobile?: boolean },
    ref: any
  ) => {
    const currentPath = useCurrentPath();

    if (groupPage == null) {
      return null;
    }

    if (isGroup(groupPage)) {
      return <GroupDropdown group={groupPage} level={level} mobile={mobile} />;
    }

    const { href, api: pageApi, openapi } = groupPage;

    const isActive = isEqualIgnoringLeadingSlash(groupPage.href, currentPath);

    const endpointStr = pageApi || openapi;
    const title = groupPage.sidebarTitle || groupPage.title || slugToTitle(href || '');

    return (
      <li ref={ref}>
        <Link href={href || '/'}>
          <a
            className={clsx(
              'flex border-l -ml-px',
              isActive
                ? 'text-primary border-current font-semibold dark:text-primary-light'
                : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
              getPaddingByLevel(level)
            )}
          >
            {endpointStr && groupPage?.hideApiMarker !== true && (
              <div
                className={clsx('mt-[0.5rem] mr-2 h-2 w-2 rounded-sm', {
                  'bg-primary dark:bg-primary-light': isActive,
                  [getMethodDotsColor(extractMethodAndEndpoint(endpointStr).method)]: !isActive,
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

const GroupDropdown = ({
  group,
  level,
  mobile,
}: {
  group: Group;
  level: number;
  mobile: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const currentPath = useCurrentPath();
  const { group: name, pages } = group;

  if (!name || !pages) {
    return null;
  }

  const onClick = () => {
    // Do not navigate if:
    // 1. We are on mobile (users need to a larger space to tap to open the menu)
    // 2. closing
    // 3. The first link is another nested menu
    // 4. The current page is in the nested pages being exposed
    if (
      !mobile &&
      !isOpen &&
      !isGroup(pages[0]) &&
      pages[0]?.href &&
      !isPathInGroupPages(currentPath, pages)
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
        pages.map((subpage) => {
          const key = isGroup(subpage) ? subpage.group : subpage.sidebarTitle || subpage.title;
          return <NavItem groupPage={subpage} level={level + 1} mobile={mobile} key={key} />;
        })}
    </>
  );
};

export function DocNav({ nav, mobile }: { nav: any; mobile: boolean }) {
  const { config } = useContext(ConfigContext);

  let numPages = 0;
  if (nav) {
    nav.forEach((group: { group: string; pages: string[] }) => {
      numPages += group.pages.length;
    });
  }

  return (
    <>
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
                    return <NavItem key={i} groupPage={page} mobile={mobile} />;
                  })}
                </ul>
              </li>
            );
          })
          .filter(Boolean)}
    </>
  );
}
