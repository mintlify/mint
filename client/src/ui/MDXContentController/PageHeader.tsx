import { useCurrentPath } from '@/hooks/useCurrentPath';
import { Meta } from '@/types/MDXContentControllerTypes';
import { UserFeedback } from '@/ui/Feedback';
import { slugToTitle } from '@/utils/titleText/slugToTitle';

type PageHeaderProps = {
  section: string;
  meta: Meta;
};

export function PageHeader({ section, meta }: PageHeaderProps) {
  const currentPath = useCurrentPath();
  const title = meta.title || slugToTitle(currentPath)
  const { description } = meta;
  if (!title && !description) return null;

  const isBlogMode = meta.mode === 'blog';

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
          {
            !isBlogMode && <UserFeedback />
          }
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
