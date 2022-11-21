import { ReactElement } from 'react';

export function TabBar({
  filename,
  children,
}: {
  filename: string;
  translucent?: boolean;
  children?: ReactElement;
}) {
  return (
    <div className="flex text-slate-400 text-xs leading-6">
      <div className="flex-none text-primary-light border-t border-b border-t-transparent border-b-primary-light px-4 py-1 flex items-center">
        {filename}
      </div>
      <div className="flex-auto flex items-center bg-slate-700/50 border border-slate-500/30 rounded-tl">
        {children && (
          <div className="flex-auto flex items-center justify-end px-4 space-x-4">{children}</div>
        )}
      </div>
    </div>
  );
}
