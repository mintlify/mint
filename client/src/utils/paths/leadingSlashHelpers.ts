export function optionallyRemoveLeadingSlash(path: string) {
  if (path.charAt(0) === '/') {
    return path.substring(1);
  }
  return path;
}

export function isEqualIgnoringLeadingSlash(path1: string | undefined, path2: string | undefined) {
  if (path1 == null || path2 == null || typeof path1 !== 'string' || typeof path2 !== 'string') {
    return false;
  }
  return optionallyRemoveLeadingSlash(path1) === optionallyRemoveLeadingSlash(path2);
}
