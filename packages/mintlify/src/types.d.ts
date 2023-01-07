type MintPage = {
  title?: string;
  description?: string;
  markdown?: string;
};

type MintNavigation = {
  group: string;
  pages: MintNavigationEntry[];
};
type MintNavigationEntry = string | MintNavigation;

type ScrapePageFn = (
  html: string,
  origin: string,
  cliDir: string,
  imageBaseDir: string,
  overwrite: boolean,
  version: string | undefined
) => Promise<MintPage>;

type ScrapeSectionFn = (
  html: string,
  origin: string,
  cliDir: string,
  imageBaseDir: string,
  overwrite: boolean,
  version: string | undefined
) => Promise<MintNavigationEntry[]>;
