export const getMethodDotsColor = (method?: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-green-600/80 dark:bg-green-400/80';
    case 'POST':
      return 'bg-blue-600/80 dark:bg-blue-400/80';
    case 'PUT':
      return 'bg-yellow-600/80 dark:bg-yellow-400/80';
    case 'DELETE':
      return 'bg-red-600/80 dark:bg-red-400/80';
    case 'PATCH':
      return 'bg-orange-600/80 dark:bg-orange-400/80';
    default:
      return 'bg-slate-600 dark:bg-slate-400/80';
  }
};
