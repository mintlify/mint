import clsx from 'clsx';
import { useContext, Fragment } from 'react';

import { SidebarContext } from '@/layouts/Sidebar';
import { TableOfContentsSection } from '@/types/TableOfContentsSection';
import { BlogSidebar } from '../Blog';

export function TableOfContents({ tableOfContents, currentSection, meta }: any) {
  let sidebarContext = useContext(SidebarContext);
  let isMainNav = Boolean(sidebarContext);

  function closeNav() {
    if (isMainNav && sidebarContext) {
      sidebarContext.setNavIsOpen(false);
    }
  }

  function isActive(section: TableOfContentsSection) {
    if (section.slug === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  let pageHasSubsections = tableOfContents.some(
    (section: TableOfContentsSection) => section.children.length > 0
  );

  if (meta.mode === 'blog') {
    return <BlogSidebar />
  }

  return (
    <ul className="text-slate-700 text-sm leading-6">
      {tableOfContents.map((section: TableOfContentsSection) => {
        let prevDepth = section.depth;
        let prevMargin = 0;
        return (
          <Fragment key={section.slug}>
            <li>
              <a
                href={`#${section.slug}`}
                onClick={closeNav}
                className={clsx(
                  'block py-1',
                  pageHasSubsections ? 'font-medium' : '',
                  isActive(section)
                    ? 'font-medium text-primary dark:text-primary-light'
                    : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                )}
              >
                {section.title}
              </a>
            </li>
            {section.children.map((subsection: TableOfContentsSection) => {
              if (subsection.depth - prevDepth >= 1) {
                prevMargin += 4;
              }
              prevDepth = subsection.depth;
              return (
                <li className={`ml-${prevMargin}`} key={subsection.slug}>
                  <a
                    href={`#${subsection.slug}`}
                    onClick={closeNav}
                    className={clsx(
                      'group flex items-start py-1 whitespace-pre-wrap',
                      isActive(subsection)
                        ? 'text-primary dark:text-primary-light'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                    )}
                  >
                    {subsection.title}
                  </a>
                </li>
              );
            })}
          </Fragment>
        );
      })}
    </ul>
  );
}
