export function optionallyRemoveLeadingSlash(path: string) {
  if (path.charAt(0) === '/') {
    return path.substring(1);
  }
  return path;
}
