import { getFileExtension } from "./getFileExtension.js";

export const fileBelongsInPagesFolder = (filename: string) => {
  const extension = getFileExtension(filename);
  return (
    extension &&
    (extension === "mdx" || extension === "md" || extension === "tsx")
  );
};
