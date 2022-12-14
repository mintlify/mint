import date from 'date-and-time';

import { useCurrentPath } from '@/hooks/useCurrentPath';
import { PageMetaTags } from '@/types/metadata';
import { UserFeedback } from '@/ui/Feedback';
import { slugToTitle } from '@/utils/titleText/slugToTitle';

import { AuthorProfile } from '../Blog';

export function BlogHeader({ pageMetadata }: { pageMetadata: PageMetaTags }) {
  const currentPath = useCurrentPath();
  const title = pageMetadata.title || slugToTitle(currentPath);
  const { description } = pageMetadata;
  if (!title && !description) return null;

  return (
    <header id="header" className="relative z-20">
      <div>
        <div className="flex">
          <div className="flex-1">
            {pageMetadata.createdDate && (
              <p className="mb-2 text-sm leading-6 font-medium text-primary dark:text-primary-light">
                {date.format(new Date(Date.parse(pageMetadata.createdDate)), 'MMMM D, YYYY')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
            {title}
          </h1>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-4 flex space-x-5">
        {pageMetadata.authors?.map((author: any) => (
          <AuthorProfile name={author.name} image={author.image} />
        ))}
      </div>
    </header>
  );
}

type PageHeaderProps = {
  section: string;
  pageMetadata: PageMetaTags;
};

export function PageHeader({ section, pageMetadata }: PageHeaderProps) {
  const currentPath = useCurrentPath();
  const title = pageMetadata.title || slugToTitle(currentPath);
  const { description } = pageMetadata;
  if (!title && !description) return null;

  return (
    <header id="header" className="relative z-20">
      <div>
        <div className="flex">
          <div className="flex-1">
            {section && (
              <p className="mb-2 text-sm leading-6 font-semibold text-primary dark:text-primary-light">
                {section}
              </p>
            )}
          </div>
          <UserFeedback />
        </div>
        <div className="flex items-center">
          <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
            {title}
          </h1>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">{description}</p>
      )}
    </header>
  );
}
