import clsx from 'clsx';
import { useEffect, useContext, useState } from 'react';
import { Rect, useRect } from 'react-use-rect';

import { useTop } from '@/hooks/useTop';
import { ContentsContext } from '@/ui/MDXContentController/MDXContentController';

type HeadingProps = {
  level: string;
  id: string;
  children: any;
  className?: string;
  hidden?: boolean;
  ignore?: boolean;
  style?: Object;
  nextElementDepth?: number | string;
};

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
}: HeadingProps | any) {
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
        'mb-2 text-sm leading-6 text-primary font-semibold tracking-normal dark:!text-primary-light':
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
          aria-label="Navigate to header"
        >
          &#8203;
          <div className="w-6 h-6 text-zinc-400 rounded-md flex items-center justify-center zinc-box bg-white ring-1 ring-zinc-400/30 dark:ring-zinc-700/25 hover:ring-zinc-400/60 dark:hover:ring-white/20">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              height="512"
              viewBox="0 0 24 24"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="m9 4c.55228 0 1 .44772 1 1v3h4v-3c0-.55228.4477-1 1-1s1 .44772 1 1v3h3c.5523 0 1 .44772 1 1s-.4477 1-1 1h-3v4h3c.5523 0 1 .4477 1 1s-.4477 1-1 1h-3v3c0 .5523-.4477 1-1 1s-1-.4477-1-1v-3h-4v3c0 .5523-.44772 1-1 1s-1-.4477-1-1v-3h-3c-.55228 0-1-.4477-1-1s.44772-1 1-1h3v-4h-3c-.55228 0-1-.44772-1-1s.44772-1 1-1h3v-3c0-.55228.44772-1 1-1zm5 10v-4h-4v4z"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </a>
      )}
      <span className={hidden ? 'sr-only' : undefined}>{children}</span>
    </Component>
  );
}
