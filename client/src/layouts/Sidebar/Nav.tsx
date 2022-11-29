import { useContext, useRef } from 'react';
import { useColors } from '@/hooks/useColors';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { PageMetaTags } from '@/types/metadata';
import { getAnchorsToDisplay } from '@/utils/getAnchorsToDisplay';
import { Anchor, findFirstNavigationEntry, Navigation } from '../../types/config';
import { StyledAnchorLink } from '../../ui/AnchorLink';
import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import isAbsoluteUrl from 'is-absolute-url';
import clsx from 'clsx';
import { DocNav } from './DocNav';
import { BlogNav } from './BlogNav';

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

function TopLevelNav({ mobile }: { mobile: boolean }) {
  const currentPath = useCurrentPath();
  const { config } = useContext(ConfigContext);
  const { selectedVersion } = useContext(VersionContext);
  const colors = useColors();

  const isRootAnchorActive = !config?.anchors?.some((anchor: Anchor) =>
    currentPath.startsWith(`/${anchor.url}`)
  );
  return (
    <>
      <StyledAnchorLink
        mobile={mobile}
        href="/"
        key="/"
        isActive={isRootAnchorActive}
        className="mb-4"
        color={colors.anchors[0]}
        icon={config?.topAnchor?.icon || 'book-open'}
        name={config?.topAnchor?.name ?? 'Documentation'}
      ></StyledAnchorLink>
      {config?.anchors &&
        getAnchorsToDisplay(config.anchors, selectedVersion, currentPath).map(
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
              <StyledAnchorLink
                key={href + anchor?.name}
                mobile={mobile}
                href={href || '/'}
                name={anchor?.name}
                icon={anchor?.icon}
                color={colors.anchors[i + 1]}
                isActive={currentPath.startsWith(`/${anchor.url}`)}
              />
            );
          }
        )}
    </>
  );
}

export function Nav({ nav, meta, mobile = false }: { nav: any; meta: PageMetaTags; mobile?: boolean }) {
  const currentPath = useCurrentPath();
  const { config } = useContext(ConfigContext);
  const activeItemRef: any = useRef();
  const previousActiveItemRef: any = useRef();
  const scrollRef: any = useRef();

  const isBlogMode = meta.mode === 'blog';

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
  }, [currentPath]);

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
        { isBlogMode ? <BlogNav nav={nav} /> : <DocNav nav={nav} mobile={mobile} /> }
      </ul>
    </nav>
  );
}