import clsx from 'clsx';
import { useEffect, useContext, useState } from 'react';
import { Rect, useRect } from 'react-use-rect';

import { useTop } from '@/hooks/useTop';
import { ContentsContext } from '@/layouts/ContentsLayout';

export function Heading({
  level,
  id,
  children,
  className = '',
  hidden = false,
  ignore = false,
  style = {},
  nextElementDepth = -1,
  ...props
}: any) {
  let Component = `h${level}`;
  const context: any = useContext(ContentsContext);
  const [rect, setRect] = useState<Rect | null>(null);
  const [rectRef] = useRect(setRect);
  let top = useTop(rect);

  // We cannot include context in the dependency array because it changes every render.
  const hasContext = Boolean(context);
  const registerHeading = context?.registerHeading;
  const unregisterHeading = context?.unregisterHeading;
  useEffect(() => {
    if (!hasContext) return;
    if (typeof top !== 'undefined') {
      registerHeading(id, top);
    }
    return () => {
      unregisterHeading(id);
    };
  }, [top, id, registerHeading, unregisterHeading, hasContext]);
  return (
    <Component
      className={clsx('group flex whitespace-pre-wrap', className, {
        '-ml-4 pl-4': !hidden,
        'text-2xl sm:text-3xl': level === '1',
        'mb-2 text-sm leading-6 text-primary font-semibold tracking-normal dark:text-primary-light':
          level === '2' && nextElementDepth > level,
      })}
      id={id}
      ref={rectRef}
      style={{ ...(hidden ? { marginBottom: 0 } : {}), ...style }}
      {...props}
    >
      {!hidden && (
        <a
          href={`#${id}`}
          className="absolute -ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100"
          aria-label="Anchor"
        >
          &#8203;
          <div className="w-6 h-6 text-slate-400 ring-1 ring-slate-900/5 rounded-md shadow-sm flex items-center justify-center hover:ring-slate-900/10 hover:shadow hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:shadow-none dark:ring-0">
            <svg width="12" height="12" fill="none" aria-hidden="true">
              <path
                d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </a>
      )}
      <span className={hidden ? 'sr-only' : undefined}>{children}</span>
    </Component>
  );
}
