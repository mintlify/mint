import Link from 'next/link';

import { useCurrentPath } from '@/hooks/useCurrentPath';
import Icon from '@/ui/Icon';

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

export function UserFeedback({ title }: { title: string }) {
  const path = useCurrentPath();
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/api/suggest?path=${path}`}>
        <a
          className="relative w-fit flex items-center p-1.5 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            icon="pencil"
            iconType="regular"
            className="h-3.5 w-3.5 block group-hover:hidden bg-slate-500 dark:bg-slate-400 group-hover:bg-slate-700 dark:group-hover:bg-slate-200"
          />
          <Icon
            icon="pencil"
            iconType="solid"
            className="h-3.5 w-3.5 hidden group-hover:block bg-slate-500 dark:bg-slate-400 group-hover:bg-slate-700 dark:group-hover:bg-slate-200"
          />
          <FeedbackTooltip message="Edit this page" />
        </a>
      </Link>
      <Link href={`/api/issue?path=${path}&title=${title}`}>
        <a
          className="relative w-fit flex items-center p-1.5 group fill-slate-500 dark:fill-slate-400 hover:fill-slate-700 dark:hover:fill-slate-200 dark:hover:text-slate-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            icon="triangle-exclamation"
            iconType="regular"
            className="h-3.5 w-3.5 block group-hover:hidden bg-slate-500 dark:bg-slate-400 group-hover:bg-slate-700 dark:group-hover:bg-slate-200"
          />
          <Icon
            icon="triangle-exclamation"
            iconType="solid"
            className="h-3.5 w-3.5 hidden group-hover:block bg-slate-500 dark:bg-slate-400 group-hover:bg-slate-700 dark:group-hover:bg-slate-200"
          />
          <FeedbackTooltip message="Raise an issue" />
        </a>
      </Link>
    </div>
  );
}
