import Link from 'next/link';
import { ConfigContext } from "@/context/ConfigContext";
import clsx from "clsx";
import { useContext } from "react";

function Article({ title, page, href }: { title: string, page: string, href: string }) {
  const { config } = useContext(ConfigContext);

  return <li
    className={clsx({
      'mt-12 lg:mt-8': !(config?.anchors == null || config.anchors?.length === 0),
    })}
  >
    <h5 className="mb-3 font-semibold text-slate-900 dark:text-slate-200">
      {title}
    </h5>
    <ul
      className={clsx(
        'space-y-6 lg:space-y-2'
      )}
    >
      <li>
        <Link href={href}>
          <a
            className={clsx(
              'flex dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
            )}
          >
            <div className="flex-1">{page}</div>
          </a>
        </Link>
      </li>
    </ul>
  </li>
}

export function BlogNav({ nav }: { nav: any }) {
  return <>
    <Article
      title='Previous Article'
      page="How to build a kickass AI Model"
      href='/'
    />
    <Article
      title='Next Article'
      page="Building Custom Video Object Counting"
      href='/'
    />
  </>
}