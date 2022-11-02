import { Combobox, Dialog, Transition } from '@headlessui/react';
import { ChevronRightIcon, FolderIcon, SearchIcon } from '@heroicons/react/outline';
import algoliasearch from 'algoliasearch';
import axios from 'axios';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import {
  Fragment,
  useState,
  useCallback,
  useRef,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { ConfigContext } from '@/context/ConfigContext';
import { VersionContext } from '@/context/VersionContext';
import { useActionKey } from '@/hooks/useActionKey';
import { pathToBreadcrumbs } from '@/utils/pathToBreadcrumbs';
import { pathToVersionDict } from '@/utils/pathToVersionDict';

const client = algoliasearch('M6VUKXZ4U5', '60f283c4bc8c9feb5c44da3df3c21ce3');
const index = client.initIndex('docs');

// @ts-ignore
const SearchContext = createContext();

type HighlightedResult = { value: string; matchLevel: 'none' | 'full' };

type Hit = {
  objectID: string;
  title: string;
  heading?: string;
  subheading?: string;
  content: string;
  slug: string;
  _highlightResult: {
    title: HighlightedResult;
    heading?: HighlightedResult;
    subheading?: HighlightedResult;
    content?: HighlightedResult;
  };
  _snippetResult: {
    heading: HighlightedResult;
    content: HighlightedResult;
  };
};

// TODO: Simplify the repeated components
function SearchHit({
  active,
  hit,
  breadcrumbs,
}: {
  active: boolean;
  hit: Hit;
  breadcrumbs: string[];
}) {
  if (hit._highlightResult.heading?.matchLevel === 'full') {
    return (
      <>
        <div
          className={clsx(
            'rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 dark:ring-0 dark:shadow-none dark:group-hover:shadow-none dark:group-hover:highlight-white/10',
            active ? 'bg-white dark:bg-primary' : 'dark:bg-slate-800'
          )}
        >
          <svg
            className="h-6 w-6 p-1.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              className={clsx(
                'stroke-primary group-hover:stroke-primary-dark dark:stroke-primary-ultralight dark:group-hover:stroke-white',
                active && 'stroke-primary-dark dark:stroke-white'
              )}
              d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
              strokeWidth="1.5"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div className="ml-3 flex-auto">
          <div className="flex items-center">
            {breadcrumbs.map((breadcrumb) => (
              <>
                <span>{breadcrumb}</span>
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
              </>
            ))}
            {hit._highlightResult.title?.value && (
              <div>
                <span
                  className={clsx(
                    'rounded-full py-px px-2 text-xs',
                    active
                      ? 'bg-primary text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                  dangerouslySetInnerHTML={{ __html: hit._highlightResult.title.value }}
                ></span>
              </div>
            )}
            <div
              className="mt-1 truncate"
              dangerouslySetInnerHTML={{ __html: hit._highlightResult.heading?.value }}
            ></div>
          </div>
        </div>
        {active && <ChevronRightIcon className="h-4 w-4 ml-3 flex-none" />}
      </>
    );
  }

  if (hit._highlightResult.subheading?.matchLevel === 'full') {
    return (
      <>
        <div
          className={clsx(
            'rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 dark:ring-0 dark:shadow-none dark:group-hover:shadow-none dark:group-hover:highlight-white/10',
            active ? 'bg-white dark:bg-primary' : 'dark:bg-slate-800'
          )}
        >
          <svg
            className="h-6 w-6 p-1.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              className={clsx(
                'stroke-primary group-hover:stroke-primary-dark dark:stroke-primary-ultralight dark:group-hover:stroke-white',
                active && 'stroke-primary-dark dark:stroke-white'
              )}
              d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
              strokeWidth="1.5"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div className="ml-3 flex-auto">
          <div className="flex items-center">
            {breadcrumbs.map((breadcrumb) => (
              <>
                <span>{breadcrumb}</span>
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
              </>
            ))}
            {hit._highlightResult.title?.value && (
              <div>
                <span
                  className={clsx(
                    'rounded-full py-px px-2 text-xs',
                    active
                      ? 'bg-primary text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                  dangerouslySetInnerHTML={{ __html: hit._highlightResult.title.value }}
                ></span>
              </div>
            )}
            <div
              className="mt-1 truncate"
              dangerouslySetInnerHTML={{ __html: hit._highlightResult.subheading?.value }}
            ></div>
          </div>
        </div>
        {active && <ChevronRightIcon className="h-4 w-4 ml-3 flex-none" />}
      </>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 dark:ring-0 dark:shadow-none dark:group-hover:shadow-none dark:group-hover:highlight-white/10',
          active ? 'bg-white dark:bg-primary' : 'dark:bg-slate-800'
        )}
      >
        <svg
          className="h-6 w-6 p-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            className={clsx(
              'fill-primary group-hover:fill-primary-dark dark:fill-primary-ultralight dark:group-hover:fill-white',
              active && 'fill-primary-dark dark:fill-white'
            )}
            d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
          ></path>
        </svg>
      </div>
      <div className="ml-3 flex-auto">
        <div className="flex items-center">
          {breadcrumbs.map((breadcrumb) => (
            <>
              <span>{breadcrumb}</span>
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
            </>
          ))}
          <div
            className="truncate"
            dangerouslySetInnerHTML={{ __html: hit._highlightResult.title.value }}
          ></div>
        </div>

        {hit._highlightResult.content?.matchLevel === 'full' &&
          hit._snippetResult.content?.value && (
            <div dangerouslySetInnerHTML={{ __html: hit._snippetResult.content.value }}></div>
          )}
      </div>
      {active && <ChevronRightIcon className="h-4 w-4 ml-3 flex-none" />}
    </>
  );
}

export function SearchProvider({ subdomain, children }: { subdomain: string; children: any }) {
  const router = useRouter();
  const { config, nav } = useContext(ConfigContext);
  const { selectedVersion } = useContext(VersionContext);
  const pathToVersion = pathToVersionDict(nav ?? [], config ?? { name: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [hits, setHits] = useState<Hit[]>([]);

  useHotkeys('cmd+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = useCallback(
    (e: any) => {
      setIsOpen(true);
      setQuery(e.key);
    },
    [setIsOpen, setQuery]
  );

  const onSearch = async (query: string) => {
    if (!query) {
      setHits([]);
      return;
    }

    const { hits } = await index.search(query, {
      filters: `orgID:${subdomain}`,
    });

    setHits(filterHitsToCurrentVersion(hits as Hit[], selectedVersion, pathToVersion));
  };

  const onSelectOption = (hit: any) => {
    onClose();

    const section =
      hit._highlightResult.subheading?.matchLevel === 'full'
        ? `#${hit.subheading}`
        : hit._highlightResult.heading?.matchLevel === 'full'
        ? `#${hit.heading}`
        : '';
    const sectionSlug = section
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-zA-Z0-9-_#]/g, '');
    router.push(`/${hit.slug}${sectionSlug}`);
    setHits([]);
  };

  return (
    <>
      <SearchContext.Provider
        value={{
          isOpen,
          onOpen,
          onClose,
          onInput,
        }}
      >
        {children}
      </SearchContext.Provider>
      {isOpen && (
        <Transition.Root
          show={isOpen}
          as={Fragment}
          afterLeave={() => {
            setQuery('');
            setHits([]);
          }}
          appear
        >
          <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-500 divide-opacity-10 overflow-hidden rounded-md bg-white dark:bg-slate-900 bg-opacity-80 shadow-2xl backdrop-blur backdrop-filter transition-all">
                  <Combobox onChange={(option) => onSelectOption(option)} value={query}>
                    <div className="relative flex items-center">
                      <SearchIcon
                        className="pointer-events-none absolute left-4 h-5 w-5 text-slate-700 dark:text-slate-400"
                        aria-hidden="true"
                      />
                      <Combobox.Input
                        className="h-14 w-full border-0 bg-transparent pl-11 pr-6 text-gray-900 dark:text-slate-100 placeholder-slate-400 focus:ring-0 sm:text-sm focus:outline-none"
                        placeholder="Find anything..."
                        onChange={(event) => onSearch(event.target.value)}
                      />
                    </div>

                    {(query === '' || hits.length > 0) && (
                      <Combobox.Options
                        static
                        className="max-h-80 scroll-py-2 divide-y divide-slate-500 divide-opacity-10 overflow-y-auto"
                      >
                        {hits.length > 0 && (
                          <li className="p-2">
                            <ul className="text-sm text-slate-700">
                              {hits.map((hit: Hit) => (
                                <Combobox.Option
                                  key={hit.objectID}
                                  value={hit}
                                  className={({ active }) =>
                                    clsx(
                                      'flex cursor-pointer select-none items-center px-3 py-2 rounded-md',
                                      active
                                        ? 'bg-primary-dark text-white dark:text-white'
                                        : 'dark:text-slate-500'
                                    )
                                  }
                                >
                                  {({ active }) => (
                                    <SearchHit
                                      active={active}
                                      hit={hit}
                                      breadcrumbs={pathToBreadcrumbs(hit.slug, config)}
                                    />
                                  )}
                                </Combobox.Option>
                              ))}
                            </ul>
                          </li>
                        )}
                      </Combobox.Options>
                    )}

                    {query !== '' && hits.length === 0 && (
                      <div className="py-14 px-6 text-center sm:px-14">
                        <FolderIcon
                          className="mx-auto h-6 w-6 text-slate-900 dark:text-slate-400 text-opacity-40"
                          aria-hidden="true"
                        />
                        <p className="mt-4 text-sm text-slate-900 dark:text-slate-400">
                          We couldn't find any projects with that term. Please try again.
                        </p>
                      </div>
                    )}
                  </Combobox>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
}

export function SearchButton({ children, ...props }: any) {
  let searchButtonRef = useRef();
  let actionKey = useActionKey();
  let { onOpen, onInput } = useContext(SearchContext) as any;

  useEffect(() => {
    function onKeyDown(event: any) {
      if (searchButtonRef && searchButtonRef.current === document.activeElement && onInput) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onInput, searchButtonRef]);

  return (
    <button type="button" ref={searchButtonRef} onClick={onOpen} {...props}>
      {typeof children === 'function' ? children({ actionKey }) : children}
    </button>
  );
}

function filterHitsToCurrentVersion(
  hits: Hit[],
  selectedVersion: string,
  pathToVersion: any
): Hit[] {
  return hits.filter((hit) => {
    const version = pathToVersion[hit.slug];

    // Pages without versioning are always included
    if (!version) {
      return true;
    }

    return version === selectedVersion;
  });
}
