import clsx from 'clsx';

export function ContentSideLayout({ sticky, children }: { sticky?: boolean; children?: any }) {
  // top-0 would stick to the top of the window. We make it larger to go under the nav bar and have a little padding
  return (
    <div className={clsx('hidden xl:flex grow', sticky && 'self-start top-20 h-auto sticky')}>
      {children}
    </div>
  );
}
