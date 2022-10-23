import { ChevronRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';

// TODO - documentationNav not available on 404. Create endpoint to get nav
import { documentationNav, isGroup } from '@/types/metadata';

export default function Error() {
  return (
    <div>
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto py-12 sm:py-20">
          <div className="text-center">
            <p className="text-xl font-semibold text-primary dark:text-primary-light">404</p>
            <h1 className="mt-2 text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight sm:text-4xl sm:tracking-tight">
              Page not found
            </h1>
            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
              But here are some other popular destinations
            </p>
          </div>
          <div className="mt-8">
            <ul className="mt-4 border-l border-slate-100 dark:border-slate-800">
              {documentationNav.slice(0, 3).map((nav) => {
                if (nav?.pages == null || nav.pages[0] == null || isGroup(nav.pages[0])) {
                  return null;
                }

                return (
                  <Link href={nav.pages[0].href || '/'}>
                    <li
                      key={nav.group}
                      className="group -ml-px relative my-3 py-2 px-6 flex items-start border-l border-transparent hover:border-primary dark:hover:border-primary-light space-x-4 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                          {nav.group}
                        </h3>
                        <h1 className="text-base font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                          {nav.pages[0].title}
                        </h1>
                        <p className="text-base text-slate-500 dark:text-slate-400">
                          {nav.pages[0].description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <ChevronRightIcon
                          className="h-5 w-5 text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                          aria-hidden="true"
                        />
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
            <div className="mt-12">
              <Link href="/">
                <a className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary">
                  Back to main page<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

Error.layoutProps = {
  meta: {
    title: '404',
  },
};
