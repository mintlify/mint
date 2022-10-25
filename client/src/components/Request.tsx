import clsx from 'clsx';

import { getMethodTextColor } from '@/utils/openApiColors';

// TO BE DEPRECATED after migrating Sieve
export function RequestSimple({
  method,
  children,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  children: React.ReactChild;
}) {
  const methodColor = getMethodTextColor(method);
  return (
    <div className="flex items-center space-x-4">
      <div className={clsx('font-bold', methodColor)}>{method}</div>
      <div className="flex-1 flex items-center font-mono">{children}</div>
    </div>
  );
}
