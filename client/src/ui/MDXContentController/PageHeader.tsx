import { UserFeedback } from '@/ui/Feedback';

type PageHeaderProps = {
  title?: string;
  description?: string;
  section: string;
  isBlogMode?: boolean;
};

export function PageHeader({ title, description, section, isBlogMode }: PageHeaderProps) {
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
