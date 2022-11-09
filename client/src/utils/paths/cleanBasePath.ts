export function cleanBasePath(basePath: string | undefined) {
  if (!basePath || basePath === '/') {
    return '';
  }

  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  if (basePath.endsWith('/')) {
    basePath = basePath.substring(0, basePath.length - 1);
  }

  return basePath;
}
