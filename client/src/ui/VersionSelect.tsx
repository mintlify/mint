import { Menu } from '@headlessui/react';
import clsx from 'clsx';

import { getVersionsSorted } from '@/utils/versions';

export function VersionSelect() {
  const versions = getVersionsSorted();
  const selectedVersion = 'v2'; // detect from storage. use latest if unspecified
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="text-xs leading-5 font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5">
        {selectedVersion}
        <svg width="6" height="3" className="ml-2 overflow-visible" aria-hidden="true">
          <path
            d="M0 0L3 3L6 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Menu.Button>
      <Menu.Items className="absolute top-full mt-1 py-2 w-40 rounded-lg bg-white shadow ring-1 ring-background-dark/5 text-sm leading-6 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:highlight-white/5">
        {versions.map((version: string) => (
          <Menu.Item disabled={version === selectedVersion}>
            {({ active }) => (
              <a
                className={clsx(
                  'flex items-center justify-between px-3 py-1',
                  active && 'bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white',
                  version === selectedVersion && 'text-primary dark:text-primary-light'
                )}
                href="https://google.com"
              >
                {version}
                {version === selectedVersion && (
                  <svg width="24" height="24" fill="none" aria-hidden="true">
                    <path
                      d="m7.75 12.75 2.25 2.5 6.25-6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </a>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
