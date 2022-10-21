import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { useState, useEffect, createContext, Fragment, useCallback, useContext } from 'react';

import { Heading } from '@/components/Heading';
import { usePrevNext } from '@/hooks/usePrevNext';
import { SidebarContext } from '@/layouts/SidebarLayout';
import { Footer } from '@/ui/Footer';
import { PageHeader } from '@/ui/PageHeader';

import { ApiSupplemental } from './ApiSupplemental';
import { OpenApiContent } from './OpenApiContent';

type Section = {
  title: string;
  slug: string;
  depth: number;
  children: any;
};

export const ContentsContext = createContext(undefined);

function TableOfContents({ tableOfContents, currentSection }: any) {
  let sidebarContext = useContext(SidebarContext);
  let isMainNav = Boolean(sidebarContext);

  function closeNav() {
    if (isMainNav && sidebarContext) {
      sidebarContext.setNavIsOpen(false);
    }
  }

  function isActive(section: Section) {
    if (section.slug === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  let pageHasSubsections = tableOfContents.some((section: Section) => section.children.length > 0);

  return (
    <>
      <ul className="text-slate-700 text-sm leading-6">
        {tableOfContents.map((section: Section) => {
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
              {section.children.map((subsection: Section) => {
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
    </>
  );
}

function useTableOfContents(tableOfContents: Section[]) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.slug);
  let [headings, setHeadings] = useState<any[]>([]);

  const registerHeading = useCallback((id: string, top: string) => {
    setHeadings((headings: any) => [
      ...headings.filter((h: { id: string }) => id !== h.id),
      { id, top },
    ]);
  }, []);

  const unregisterHeading = useCallback((id: string) => {
    setHeadings((headings) => headings.filter((h) => id !== h.id));
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0 || headings.length === 0) return;
    function onScroll() {
      let style = window.getComputedStyle(document.documentElement);
      let scrollMt = parseFloat(style.getPropertyValue('--scroll-mt').match(/[\d.]+/)?.[0] ?? '0');
      let fontSize = parseFloat(style.fontSize.match(/[\d.]+/)?.[0] ?? '16');
      scrollMt = scrollMt * fontSize;

      let sortedHeadings = headings.concat([]).sort((a, b) => a.top - b.top);
      let top = window.pageYOffset + scrollMt + 1;
      let current = sortedHeadings[0].id;
      for (let i = 0; i < sortedHeadings.length; i++) {
        if (top >= sortedHeadings[i].top) {
          current = sortedHeadings[i].id;
        }
      }
      setCurrentSection(current);
    }
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      } as any);
    };
  }, [headings, tableOfContents]);

  useEffect(() => {
    document.querySelectorAll('.copy-to-clipboard').forEach((item) => {
      item.addEventListener('click', () => {
        const codeElement = item.nextSibling;
        if (!codeElement || !window.getSelection) {
          return;
        }
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(codeElement);
        selection?.removeAllRanges();
        selection?.addRange(range);

        navigator.clipboard.writeText(selection?.toString() || '');

        const tooltip = item.getElementsByClassName('tooltip')[0];
        tooltip.classList.remove('hidden');
        setTimeout(() => {
          tooltip.classList.add('hidden');
        }, 2000);
      });
    });
  }, []);

  return { currentSection, registerHeading, unregisterHeading };
}

export type Meta = {
  title?: string;
  description?: string;
  sidebarTitle?: string;
  auth?: string;
  api?: string;
  openapi?: string;
  contentType?: string;
  size?: 'wide';
  version?: string;
};

type ContentsLayoutProps = {
  children: any;
  meta: Meta;
  tableOfContents: any;
  section: string;
  apiComponents: any;
};

export function ContentsLayout({
  children,
  meta,
  tableOfContents,
  section,
  apiComponents,
}: ContentsLayoutProps) {
  const toc = [...tableOfContents];

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc);
  let { prev, next } = usePrevNext();

  const hasApiSupplementalComponents = apiComponents.some(
    (component: any) => component.type === 'ResponseExample' || component.type === 'RequestExample'
  );

  const isWideSize = meta.size === 'wide';

  return (
    <div
      className={clsx(
        'relative max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0',
        hasApiSupplementalComponents
          ? 'xl:pr-12 xl:mr-[28rem]'
          : isWideSize
          ? 'xl:pr-20 xl:mr-[12rem]'
          : 'xl:pr-20 xl:mr-[18rem]'
      )}
    >
      <PageHeader
        title={meta.title}
        description={meta.description}
        api={meta.api}
        openapi={meta.openapi}
        contentType={meta.contentType}
        auth={meta.auth}
        section={section}
        children={children}
        apiComponents={apiComponents}
      />
      <ContentsContext.Provider value={{ registerHeading, unregisterHeading } as any}>
        <div id="content-wrapper" className="relative z-20 prose prose-slate mt-8 dark:prose-dark">
          <MDXProvider components={{ Heading }}>{children}</MDXProvider>
        </div>
      </ContentsContext.Provider>

      {meta.openapi && <OpenApiContent openapi={meta.openapi} auth={meta.auth} />}

      <Footer previous={prev} next={next} hasBottomPadding={!hasApiSupplementalComponents} />
      <div
        className={clsx(
          'z-10 hidden xl:block pr-8',
          hasApiSupplementalComponents
            ? 'w-[30rem] absolute top-[7.6rem] left-full h-full'
            : 'fixed pl-8 w-[21rem] top-[3.8rem] bottom-0 right-[max(0px,calc(50%-45rem))] py-10 overflow-auto'
        )}
      >
        {!hasApiSupplementalComponents && toc.length > 0 && !isWideSize && (
          <TableOfContents tableOfContents={toc} currentSection={currentSection} meta={meta} />
        )}
        {hasApiSupplementalComponents && (
          <div className="sticky top-[6rem] left-0">
            <ApiSupplemental openapi={meta.openapi} apiComponents={apiComponents} />
          </div>
        )}
      </div>
    </div>
  );
}
