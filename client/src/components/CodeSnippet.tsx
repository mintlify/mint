import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { TabBar } from '@/components/TabBar';

export function CodeSnippet({ filename, children }: { filename?: string; children?: any }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div
      className={clsx(
        'mt-5 mb-8 first:mt-0 last:mb-0 bg-slate-800 rounded-xl shadow-lg overflow-hidden dark:ring-1 dark:ring-white/10 dark:ring-inset',
        filename && 'pt-2'
      )}
    >
      {filename ? <TabBar filename={filename} /> : null}
      <div className="children:my-0 children:!shadow-none children:bg-transparent relative">
        {hydrated ? children : null}
      </div>
    </div>
  );
}
