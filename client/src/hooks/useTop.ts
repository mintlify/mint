import { useState, useEffect } from 'react';
import { Rect } from 'react-use-rect';

export function useTop(rect: Rect | null) {
  let [top, setTop] = useState<number>();
  let rectTop = rect ? rect.top : undefined;
  useEffect(() => {
    if (typeof rectTop === 'undefined') return;
    let newTop = rectTop + window.pageYOffset;
    if (newTop !== top) {
      setTop(newTop);
    }
  }, [rectTop, top]);
  return top;
}
