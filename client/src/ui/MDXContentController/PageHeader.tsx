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
      <li className="flex items-center font-medium whitespace-nowrap mt-6">
        <img src="https://mintlify.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdeclan.70da18ee.jpeg&w=96&q=75" alt="" className="mr-3 w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-600 dark:border-slate-400" decoding="async" />
          <div className="text-sm leading-4">
            <div className="text-slate-900 dark:text-slate-200">Han Wang</div>
            <div className="mt-1">
              <a href="https://twitter.com/adamwathan" className="text-primary hover:text-primary-dark dark:text-primary-light">3 min read</a>
            </div>
          </div>
        </li>
    </header>
  );
}
