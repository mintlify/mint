import { useState, useCallback, useEffect } from 'react';

import { TableOfContentsSection } from '@/types/tableOfContentsSection';

export function useTableOfContents(tableOfContents: TableOfContentsSection[]) {
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

  return { currentSection, registerHeading, unregisterHeading };
}
