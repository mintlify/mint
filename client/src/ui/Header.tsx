import { brands, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import clsx from 'clsx';
import gh from 'github-url-to-object';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';

import { Logo } from '@/ui/Logo';
import { SearchButton } from '@/ui/Search';

import { config, GitHubLink, TopbarCta } from '../config';
import { ThemeSelect, ThemeToggle } from './ThemeToggle';

export function NavPopover({
  display = 'md:hidden',
  className,
  ...props
}: {
  display: string;
  className: string;
}) {
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function handleRouteChange() {
      setIsOpen(false);
    }
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [isOpen]);

  return (
    <div className={clsx(className, display)} {...props}>
      <button
        type="button"
        className="text-slate-500 w-8 h-8 flex items-center justify-center hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Navigation</span>
        <svg width="24" height="24" fill="none" aria-hidden="true">
          <path
            d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <Dialog
        as="div"
        className={clsx('fixed z-50 inset-0', display)}
        open={isOpen}
        onClose={setIsOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
        <div className="fixed top-4 right-4 w-full max-w-xs bg-white rounded-lg shadow-lg p-6 text-base font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:highlight-white/5">
          <button
            type="button"
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close navigation</span>
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible" aria-hidden="true">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ul className="space-y-6">
            <NavItems />
          </ul>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-200/10">
            <ThemeSelect />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function GitHubCta({ button }: { button: GitHubLink }) {
  const [repoData, setRepoData] = useState<{ stargazers_count: number; forks_count: number }>();

  const github = gh(button.url);

  useEffect(() => {
    if (github == null) {
      return;
    }

    axios.get(`https://api.github.com/repos/${github.user}/${github.repo}`).then(({ data }) => {
      setRepoData(data);
    });
  }, []);

  if (github == null) {
    return null;
  }

  return (
    <li className="cursor-pointer">
      <Link href={button.url}>
        <div className="group flex items-center space-x-3">
          <FontAwesomeIcon className="h-6 w-6" icon={brands('github-square')} />
          <div className="font-normal">
            <div className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-200">
              {github.user}/{github.repo}
            </div>
            {repoData ? (
              <div className="text-xs flex items-center space-x-2 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                <span className="flex items-center space-x-1">
                  <FontAwesomeIcon className="h-3 w-3" icon={regular('star')} />
                  <span>{repoData.stargazers_count}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FontAwesomeIcon className="h-3 w-3" icon={regular('code-fork')} />
                  <span>{repoData.forks_count}</span>
                </span>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

function TopBarCtaButton({ button }: { button: TopbarCta }) {
  if (button.type === 'github') {
    return <GitHubCta button={button} />;
  }

  return (
    <li>
      <Link href={button.url}>
        <a
          target="_blank"
          className={clsx(
            config.classes?.topbarCtaButton ||
              'relative inline-flex items-center space-x-1 px-4 py-1 border border-transparent shadow-sm text-sm font-medium rounded-[0.3rem] text-white bg-primary-dark hover:bg-primary-ultradark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-light'
          )}
        >
          <span>{button.name}</span>
          {!config.classes?.topbarCtaButton && (
            <svg
              className="h-2.5 text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
            </svg>
          )}
        </a>
      </Link>
    </li>
  );
}

export function NavItems() {
  return (
    <>
      {config?.topbarLinks?.map((topbarLink) => (
        <li key={topbarLink.name}>
          <Link href={topbarLink.url}>
            <a className="font-medium hover:text-primary dark:hover:text-primary-light">
              {topbarLink.name}
            </a>
          </Link>
        </li>
      ))}
      {config?.topbarCtaButton && <TopBarCtaButton button={config.topbarCtaButton} />}
    </>
  );
}

export function Header({
  hasNav = false,
  navIsOpen,
  onNavToggle,
  title,
  section,
}: {
  hasNav: boolean;
  navIsOpen: boolean;
  onNavToggle: (toggle: boolean) => void;
  title?: string;
  section?: string;
}) {
  let [isOpaque, setIsOpaque] = useState(false);

  useEffect(() => {
    let offset = 50;
    function onScroll() {
      if (!isOpaque && window.scrollY > offset) {
        setIsOpaque(true);
      } else if (isOpaque && window.scrollY <= offset) {
        setIsOpaque(false);
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isOpaque]);

  return (
    <>
      <div
        className={clsx(
          'sticky top-0 w-full backdrop-blur flex-none transition-colors z-40 duration-500 lg:border-b lg:border-slate-900/5 dark:border-slate-50/[0.06] lg:z-50',
          isOpaque
            ? 'bg-background-light/90 supports-backdrop-blur:bg-background-light/90 dark:bg-background-dark/75'
            : 'bg-transparent dark:bg-transparent'
        )}
      >
        <div className="max-w-8xl mx-auto">
          <div
            className={clsx(
              'py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10',
              hasNav ? 'mx-4 lg:mx-0' : 'px-4'
            )}
          >
            <div className="relative flex items-center">
              <div className="flex-1">
                <Link href={config?.logoHref ?? '/'}>
                  <a
                    onContextMenu={(e) => {
                      e.preventDefault();
                      Router.push(config?.logoHref ?? '/');
                    }}
                  >
                    <span className="sr-only">{config.name} home page</span>
                    <Logo className="w-auto h-7 relative" />
                  </a>
                </Link>
              </div>
              <div className="relative flex-none bg-white lg:w-64 xl:w-80 dark:bg-slate-900 pointer-events-auto rounded-md">
                <SearchButton className="hidden w-full lg:flex items-center text-sm leading-6 text-slate-400 rounded-md ring-1 ring-slate-500/10 shadow-sm py-1.5 pl-2 pr-3 bg-slate-50 hover:ring-slate-900/20 dark:bg-slate-800 dark:highlight-white/5 dark:hover:bg-slate-700">
                  {({ actionKey }: any) => (
                    <>
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        aria-hidden="true"
                        className="mr-3 flex-none"
                      >
                        <path
                          d="m19 19-3.5-3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="11"
                          cy="11"
                          r="6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Search...
                      {actionKey && (
                        <span className="ml-auto flex-none text-xs font-semibold">
                          {actionKey[0]}K
                        </span>
                      )}
                    </>
                  )}
                </SearchButton>
              </div>
              <div className="flex-1 relative hidden lg:flex items-center ml-auto justify-end">
                <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
                  <ul className="flex space-x-8 items-center">
                    <NavItems />
                  </ul>
                </nav>
                <div className="flex items-center border-l border-slate-100 ml-6 pl-6 dark:border-slate-800">
                  <ThemeToggle panelClassName="mt-8" />
                </div>
              </div>
              <SearchButton className="ml-auto text-slate-500 w-8 h-8 -my-1 flex items-center justify-center hover:text-slate-600 lg:hidden dark:text-slate-400 dark:hover:text-slate-300">
                <span className="sr-only">Search</span>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m19 19-3.5-3.5" />
                  <circle cx="11" cy="11" r="6" />
                </svg>
              </SearchButton>
              <NavPopover className="ml-2 -my-1" display="lg:hidden" />
            </div>
          </div>
          {hasNav && (
            <div className="flex items-center p-4 border-b border-slate-900/10 lg:hidden dark:border-slate-50/[0.06]">
              <button
                type="button"
                onClick={() => onNavToggle(!navIsOpen)}
                className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <span className="sr-only">Navigation</span>
                <svg width="24" height="24">
                  <path
                    d="M5 6h14M5 12h14M5 18h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {title && (
                <ol className="ml-4 flex text-sm leading-6 whitespace-nowrap min-w-0">
                  {section && (
                    <li className="flex items-center">
                      {section}
                      <svg
                        width="3"
                        height="6"
                        aria-hidden="true"
                        className="mx-3 overflow-visible text-slate-400"
                      >
                        <path
                          d="M0 0L3 3L0 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </li>
                  )}
                  <li className="font-semibold text-slate-900 truncate dark:text-slate-200">
                    {title}
                  </li>
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
