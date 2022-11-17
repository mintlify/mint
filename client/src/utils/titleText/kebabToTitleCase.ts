export function kebabToTitleCase(str: string) {
  return str.replace(/(?:^|-)([a-z])/gi, (m, p1) => ` ${p1.toUpperCase()}`).trim()
}
