// For PostCSS parsers
export const getAnchorBackgroundColor = (i: number, color?: string) => {
  if (!color) {
    return 'bg-primary dark:bg-primary-light';
  }

  switch (i) {
    case 0:
      return 'bg-anchor-0';
    case 1:
      return 'bg-anchor-1';
    case 2:
      return 'bg-anchor-2';
    case 3:
      return 'bg-anchor-3';
    case 4:
      return 'bg-anchor-4';
    case 5:
      return 'bg-anchor-5';
    case 6:
      return 'bg-anchor-6';
    case 7:
      return 'bg-anchor-7';
    case 8:
      return 'bg-anchor-8';
    case 9:
      return 'bg-anchor-9';
    case 10:
      return 'bg-anchor-10';
    default:
      return 'bg-primary dark:bg-primary-light';
  }
};

export const getAnchorHoverBackgroundColor = (i: number, color?: string) => {
  if (!color) {
    return 'group-hover:bg-primary dark:group-hover:bg-primary-light';
  }

  switch (i) {
    case 0:
      return 'group-hover:bg-anchor-0';
    case 1:
      return 'group-hover:bg-anchor-1';
    case 2:
      return 'group-hover:bg-anchor-2';
    case 3:
      return 'group-hover:bg-anchor-3';
    case 4:
      return 'group-hover:bg-anchor-4';
    case 5:
      return 'group-hover:bg-anchor-5';
    case 6:
      return 'group-hover:bg-anchor-6';
    case 7:
      return 'group-hover:bg-anchor-7';
    case 8:
      return 'group-hover:bg-anchor-8';
    case 9:
      return 'group-hover:bg-anchor-9';
    case 10:
      return 'group-hover:bg-anchor-10';
    default:
      return 'group-hover:bg-primary dark:group-hover:bg-primary-light';
  }
};

export const getAnchorTextColor = (i: number, color?: string) => {
  if (!color) {
    return 'text-primary dark:text-primary-light';
  }

  switch (i) {
    case 0:
      return 'text-anchor-0';
    case 1:
      return 'text-anchor-1';
    case 2:
      return 'text-anchor-2';
    case 3:
      return 'text-anchor-3';
    case 4:
      return 'text-anchor-4';
    case 5:
      return 'text-anchor-5';
    case 6:
      return 'text-anchor-6';
    case 7:
      return 'text-anchor-7';
    case 8:
      return 'text-anchor-8';
    case 9:
      return 'text-anchor-9';
    case 10:
      return 'text-anchor-10';
    default:
      return 'text-primary dark:text-primary-light';
  }
};

export const getAnchorShadowColor = (i: number, color?: string) => {
  if (!color) {
    return 'shadow-primary/40';
  }

  switch (i) {
    case 0:
      return 'shadow-anchor-0/40';
    case 1:
      return 'shadow-anchor-1/40';
    case 2:
      return 'shadow-anchor-2/40';
    case 3:
      return 'shadow-anchor-3/40';
    case 4:
      return 'shadow-anchor-4/40';
    case 5:
      return 'shadow-anchor-5/40';
    case 6:
      return 'shadow-anchor-6/40';
    case 7:
      return 'shadow-anchor-7/40';
    case 8:
      return 'shadow-anchor-8/40';
    case 9:
      return 'shadow-anchor-9/40';
    case 10:
      return 'shadow-anchor-10/40';
    default:
      return 'shadow-primary/40';
  }
};

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

export const getMethodBgColor = (method?: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-green-600';
    case 'POST':
      return 'bg-blue-600';
    case 'PUT':
      return 'bg-yellow-600';
    case 'DELETE':
      return 'bg-red-600';
    case 'PATCH':
      return 'bg-orange-600';
    default:
      return 'bg-slate-600';
  }
};

export const getMethodBgColorWithHover = (method?: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-green-600 hover:bg-green-800 disabled:bg-green-700';
    case 'POST':
      return 'bg-blue-600 hover:bg-blue-800 disabled:bg-blue-700';
    case 'PUT':
      return 'bg-yellow-600 hover:bg-yellow-800 disabled:bg-yellow-700';
    case 'DELETE':
      return 'bg-red-600 hover:bg-red-800 disabled:bg-red-700';
    case 'PATCH':
      return 'bg-orange-600 hover:bg-orange-800 disabled:bg-orange-700';
    default:
      return 'bg-slate-600 hover:bg-slate-800 disabled:bg-slate-700';
  }
};

export const getMethodTextColor = (method?: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'text-green-600 dark:text-green-500';
    case 'POST':
      return 'text-blue-600 dark:text-blue-500';
    case 'PUT':
      return 'text-yellow-600 dark:text-yellow-500';
    case 'DELETE':
      return 'text-red-600 dark:text-red-500';
    case 'PATCH':
      return 'text-orange-600 dark:text-orange-500';
    default:
      return 'text-slate-600 dark:text-slate-500';
  }
};

export const getMethodBorderColor = (method?: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'border-green-600 dark:border-green-500';
    case 'POST':
      return 'border-blue-600 dark:border-blue-500';
    case 'PUT':
      return 'border-yellow-600 dark:border-yellow-500';
    case 'DELETE':
      return 'border-red-600 dark:border-red-500';
    case 'PATCH':
      return 'border-orange-600 dark:border-orange-500';
    default:
      return 'border-slate-600 dark:border-slate-500';
  }
};
