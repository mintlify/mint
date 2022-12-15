import Link from 'next/link';
import { createContext, useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';

// @ts-ignore
const FeedbackContext = createContext();

const FeedbackTooltip = ({ message }: { message: string }) => {
  return (
    <div className="absolute hidden group-hover:block bottom-full left-1/2 mb-3.5 pb-1 -translate-x-1/2">
      <div
        className="relative w-24 flex justify-center bg-primary-dark text-white text-xs font-medium py-0.5 px-1.5 rounded-lg"
        data-reach-alert="true"
      >
        {message}
        <svg
          aria-hidden="true"
          width="16"
          height="6"
          viewBox="0 0 16 6"
          className="text-primary-dark absolute top-full left-1/2 -mt-px -ml-2"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export function UserFeedback() {
  const path = useCurrentPath();
  const { config } = useContext(ConfigContext);
  const { createSuggestHref, createIssueHref } = useContext(FeedbackContext) as any;

  if (config?.hideFeedbackButtons === true) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={createSuggestHref(path)}
        className="relative w-fit flex items-center p-1.5 group"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="h-3.5 w-3.5 block group-hover:hidden fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-700 dark:group-hover:fill-slate-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M58.57 323.5L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75C495.8 61.87 498.5 65.24 500.9 68.79C517.3 93.63 514.6 127.4 492.7 149.3L188.5 453.4C187.2 454.7 185.9 455.1 184.5 457.2C174.9 465.7 163.5 471.1 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L58.57 323.5zM82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L383 191L320.1 128.1L92.51 357.4C91.92 358 91.35 358.6 90.8 359.3C86.94 363.6 84.07 368.8 82.42 374.4L82.42 374.4z" />
        </svg>
        <svg
          className="h-3.5 w-3.5 hidden group-hover:block fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-700 dark:group-hover:fill-slate-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
        </svg>
        <FeedbackTooltip message="Edit this page" />
      </Link>
      <Link
        href={createIssueHref(path)}
        className="relative w-fit flex items-center p-1.5 group fill-slate-500 dark:fill-slate-400 hover:fill-slate-700 dark:hover:fill-slate-200 dark:hover:text-slate-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="h-3.5 w-3.5 block group-hover:hidden fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-700 dark:group-hover:fill-slate-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M506.3 417l-213.3-364C284.8 39 270.4 32 256 32C241.6 32 227.2 39 218.1 53l-213.2 364C-10.59 444.9 9.851 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM52.58 432L255.1 84.8L459.4 432H52.58zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44c0 17.36 14.11 31.44 31.48 31.44s31.4-14.08 31.4-31.44C287.4 351.2 273.4 337.1 256 337.1zM232 184v96C232 293.3 242.8 304 256 304s24-10.75 24-24v-96C280 170.8 269.3 160 256 160S232 170.8 232 184z" />
        </svg>
        <svg
          className="h-3.5 w-3.5 hidden group-hover:block fill-slate-500 dark:fill-slate-400 group-hover:fill-slate-700 dark:group-hover:fill-slate-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z" />
        </svg>
        <FeedbackTooltip message="Raise an issue" />
      </Link>
    </div>
  );
}

export function FeedbackProvider({ subdomain, children }: { subdomain: string; children: any }) {
  const createSuggestHref = (path: string) => {
    return `https://server.mintlify.com/api/v1/app/suggest/${subdomain}?path=${path}.mdx`;
  };

  const createIssueHref = (path: string) => {
    return `https://server.mintlify.com/api/v1/app/issue/${subdomain}?path=${path}.mdx`;
  };

  return (
    <FeedbackContext.Provider
      value={{
        createSuggestHref,
        createIssueHref,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}
