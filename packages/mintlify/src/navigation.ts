export type NavigationEntry = string | Navigation;

export type Navigation = {
  group: string;
  pages: NavigationEntry[];
};

export function isNavigation(
  navEntry: NavigationEntry
): navEntry is Navigation {
  return typeof navEntry !== "string";
}
