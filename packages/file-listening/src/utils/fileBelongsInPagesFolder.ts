import pathUtil from "path";

export const fileBelongsInPagesFolder = (filename: string) => {
  try {
    const extension = pathUtil.parse(filename).ext;
    return (
      extension &&
      (extension === ".mdx" || extension === ".md" || extension === ".tsx")
    );
  } catch (e) {
    // TypeError when filename is not a string
    return false;
  }
};
