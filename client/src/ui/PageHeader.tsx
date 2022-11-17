import { UserFeedback } from '@/ui/Feedback';
import { ApiPlayground, ApiComponent } from '@/ui/ApiPlayground';

type PageHeaderProps = {
  title?: string;
  description?: string;
  api?: string;
  openapi?: string;
  contentType?: string;
  auth?: string;
  section: string;
  children: any;
  apiComponents: ApiComponent[];
};

export function PageHeader({
  title,
  description,
  section,
  api,
  contentType, // TODO: Add documentation
  auth,
  children,
  apiComponents,
}: PageHeaderProps) {
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
          <UserFeedback title="" />
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
      {api && (
        <ApiPlayground
          api={api}
          children={children}
          auth={auth}
          apiComponents={apiComponents}
          contentType={contentType}
        />
      )}
    </header>
  );
}
