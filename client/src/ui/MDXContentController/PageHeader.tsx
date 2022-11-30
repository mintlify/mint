import date from 'date-and-time';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { PageMetaTags } from '@/types/metadata';
import { UserFeedback } from '@/ui/Feedback';
import { slugToTitle } from '@/utils/titleText/slugToTitle';
import { AuthorProfile } from '../Blog';

export function BlogHeader({ meta }: { meta: PageMetaTags }) {
  const currentPath = useCurrentPath();
  const title = meta.title || slugToTitle(currentPath)
  const { description } = meta;
  if (!title && !description) return null;

  return (<header id="header" className="relative z-20">
      <div>
        <div className="flex">
          <div className="flex-1">
            {meta.createdDate && (
              <p className="mb-2 text-sm leading-6 font-medium text-primary dark:text-primary-light">
                {date.format(new Date(Date.parse(meta.createdDate)), 'MMMM D, YYYY')}
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
        {
          meta.authors?.map((author: any) => (
            <AuthorProfile name={author.name} image={author.image} />
          ))
        }
      </div>
    </header>)
}

type PageHeaderProps = {
  section: string;
  meta: PageMetaTags;
};

export function PageHeader({ section, meta }: PageHeaderProps) {
  const currentPath = useCurrentPath();
  const title = meta.title || slugToTitle(currentPath)
  const { description } = meta;
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
