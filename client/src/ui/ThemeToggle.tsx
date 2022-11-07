import { Listbox } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useEffect, useRef, useContext, useCallback } from 'react';
import create from 'zustand';

import { ConfigContext } from '@/context/ConfigContext';
import { useColors } from '@/hooks/useColors';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

const useSetting = create((set: any) => ({
  setting: 'system',
  setSetting: (setting: string) => set({ setting }),
})) as any;

let settings = [
  {
    value: 'light',
    label: 'Light',
    icon: SunIcon,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: MoonIcon,
  },
  {
    value: 'system',
    label: 'System',
    icon: PcIcon,
  },
];

function SunIcon({ selected, ...props }: { selected?: boolean; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        className={selected ? 'stroke-yellow-500' : 'stroke-slate-400 dark:stroke-slate-500'}
      />
      <path
        d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
        className={selected ? 'stroke-yellow-500' : 'stroke-slate-400 dark:stroke-slate-500'}
      />
    </svg>
  );
}

function MoonIcon({ selected, ...props }: { selected: boolean; className: string }) {
  const colors = useColors();
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
        style={selected ? { fill: colors.primaryLight + '33' } : {}}
      />
      <path
        d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
        className={
          selected ? 'fill-primary dark:fill-primary-light' : 'fill-slate-400 dark:fill-slate-500'
        }
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
        className={
          selected ? 'fill-primary dark:fill-primary-light' : 'fill-slate-400 dark:fill-slate-500'
        }
      />
    </svg>
  );
}

function PcIcon({ selected, ...props }: { selected: boolean; className: string }) {
  const colors = useColors();
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        strokeWidth="2"
        strokeLinejoin="round"
        className={
          selected
            ? 'stroke-primary dark:stroke-primary-light'
            : 'stroke-slate-400 dark:stroke-slate-500'
        }
        style={selected ? { fill: colors.primaryLight + '33' } : {}}
      />
      <path
        d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          selected
            ? 'stroke-primary dark:stroke-primary-light'
            : 'stroke-slate-400 dark:stroke-slate-500'
        }
      />
    </svg>
  );
}

function useTheme() {
  const { config } = useContext(ConfigContext);
  let { setting, setSetting } = useSetting();
  let initial = useRef(true);

  const update = useCallback(() => {
    if (isDarkModeEnabled(config?.modeToggle?.default)) {
      document.documentElement.classList.add('dark', 'changing-theme');
    } else {
      document.documentElement.classList.remove('dark', 'changing-theme');
    }
    window.setTimeout(() => {
      document.documentElement.classList.remove('changing-theme');
    });
  }, [config?.modeToggle?.default]);

  useIsomorphicLayoutEffect(() => {
    let theme = localStorage.theme;
    if (theme === 'light' || theme === 'dark') {
      setSetting(theme);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (setting === 'system') {
      localStorage.removeItem('theme');
    } else if (setting === 'light' || setting === 'dark') {
      localStorage.theme = setting;
    }
    if (initial.current) {
      initial.current = false;
    } else {
      update();
    }
  }, [setting]);

  useEffect(() => {
    let mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', update);
    } else {
      mediaQuery.addListener(update);
    }

    function onStorage() {
      update();
      let theme = localStorage.theme;
      if (theme === 'light' || theme === 'dark') {
        setSetting(theme);
      } else {
        setSetting('system');
      }
    }
    window.addEventListener('storage', onStorage);

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', update);
      } else {
        mediaQuery.removeListener(update);
      }

      window.removeEventListener('storage', onStorage);
    };
  }, [setSetting, update]);

  return [setting, setSetting];
}

export function ThemeToggle({ panelClassName = 'mt-4' }) {
  const { config } = useContext(ConfigContext);
  let [setting, setSetting] = useTheme();

  if (config?.modeToggle?.isHidden) {
    return null;
  }

  return (
    <Listbox value={setting} onChange={setSetting}>
      <Listbox.Label className="sr-only">Theme</Listbox.Label>
      <Listbox.Button type="button">
        <span className="dark:hidden">
          <SunIcon className="w-6 h-6" selected={setting !== 'system'} />
        </span>
        <span className="hidden dark:inline">
          <MoonIcon className="w-6 h-6" selected={setting !== 'system'} />
        </span>
      </Listbox.Button>
      <Listbox.Options
        className={clsx(
          'absolute z-50 top-full right-0 bg-white rounded-lg ring-1 ring-slate-900/10 shadow-lg overflow-hidden w-36 py-1 text-sm text-slate-700 font-medium dark:bg-slate-800 dark:ring-0 dark:highlight-white/5 dark:text-slate-300',
          panelClassName
        )}
      >
        {settings.map(({ value, label, icon: Icon }) => (
          <Listbox.Option key={value} value={value} as={Fragment}>
            {({ active, selected }) => (
              <li
                className={clsx(
                  'py-1 px-2 flex items-center cursor-pointer',
                  selected
                    ? value === 'light'
                      ? 'text-yellow-500'
                      : 'text-primary dark:text-primary-light'
                    : '',
                  active && 'bg-slate-50 dark:bg-slate-600/30'
                )}
              >
                <Icon selected={selected} className="w-6 h-6 mr-2" />
                {label}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}

export function ThemeSelect() {
  const { config } = useContext(ConfigContext);
  let [setting, setSetting] = useTheme();

  if (config?.modeToggle?.isHidden) {
    return null;
  }

  const foundSetting = settings.find((x) => x.value === setting);
  if (foundSetting == null) {
    return null;
  }

  const { label } = foundSetting;

  return (
    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-200/10">
      <div className="flex items-center justify-between">
        <label htmlFor="theme" className="text-slate-700 font-normal dark:text-slate-400">
          Switch theme
        </label>
        <div className="relative flex items-center ring-1 ring-slate-900/10 rounded-lg shadow-sm p-2 text-slate-700 font-semibold dark:bg-slate-600 dark:ring-0 dark:highlight-white/5 dark:text-slate-200">
          <SunIcon className="w-6 h-6 mr-2 dark:hidden" />
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 mr-2 hidden dark:block">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
              className="fill-transparent"
            />
            <path
              d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
              className="fill-slate-400"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
              className="fill-slate-400"
            />
          </svg>
          {label}
          <svg className="w-6 h-6 ml-2 text-slate-400" fill="none">
            <path
              d="m15 11-3 3-3-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <select
            id="theme"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            className="absolute appearance-none inset-0 w-full h-full opacity-0"
          >
            {settings.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function isDarkModeEnabled(modeToggleDefault: string | undefined) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (
    localStorage.theme === 'dark' ||
    (modeToggleDefault == null &&
      !('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) ||
    modeToggleDefault === 'dark'
  );
}
