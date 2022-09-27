import { useState, useEffect } from 'react';

export function useTop(rect) {
  let [top, setTop] = useState();
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
