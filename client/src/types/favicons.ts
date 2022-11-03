export type FaviconsProps = {
  icons: {
    rel: string;
    href: string;
    type: string;
    sizes?: string;
  }[];
  browserconfig: string;
};
