export type NavigationEntry = string | NavigationType;

export type NavigationType = {
  group: string;
  pages: NavigationEntry[];
  version?: string;
};
