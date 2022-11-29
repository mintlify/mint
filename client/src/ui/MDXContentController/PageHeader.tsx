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
  const description = meta.description
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
      {
        isBlogMode && <div className="flex items-center font-medium whitespace-nowrap mt-6">
        <img src="https://mintlify.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdeclan.70da18ee.jpeg&w=96&q=75" alt="" className="mr-3 w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-400 dark:border-slate-500" decoding="async" />
          <div className="text-sm leading-4">
            <div className="text-slate-900 dark:text-slate-200">Han Wang</div>
            <div className="mt-1">
              <div className="flex items-center text-primary dark:text-primary-light">
                August 30 <div className="mx-1 text-[0.5rem] text-slate-400 dark:text-slate-500">•</div> 3 min read
              </div>
            </div>
          </div>
        </div>
      }
    </header>
  );
}
