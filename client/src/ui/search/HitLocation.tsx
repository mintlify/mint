import clsx from 'clsx';

export function HitLocation({
  active,
  breadcrumbComponents,
  hitHtml,
  bubbleHtml,
}: {
  active: boolean;
  breadcrumbComponents: any[];
  hitHtml: any;
  bubbleHtml?: any;
}) {
  const bubble = bubbleHtml && (
    <div className="mr-2 max-w-[50%]">
      <p
        className={clsx(
          'rounded-full py-px px-2 text-xs truncate',
          active
            ? 'bg-primary text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
        )}
        dangerouslySetInnerHTML={{ __html: bubbleHtml }}
      ></p>
    </div>
  );

  // Show bubble with breadcrumbs when they exist
  if (breadcrumbComponents.length > 0) {
    return (
      <div className="ml-3 flex-auto">
        <div className="flex items-center">
          {breadcrumbComponents}
          {bubble}
        </div>
        <p dangerouslySetInnerHTML={{ __html: hitHtml }}></p>
      </div>
    );
  } else {
    // Show bubble beside hit
    return (
      <div className="ml-3 flex-auto w-full">
        <div className="flex items-center">
          {bubble}
          <p dangerouslySetInnerHTML={{ __html: hitHtml }}></p>
        </div>
      </div>
    );
  }
}
