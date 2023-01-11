import pathUtil from "path";

export const fileIsMdxOrMd = (filename: string) => {
  try {
    const extension = pathUtil.parse(filename).ext;
    return extension && (extension === ".mdx" || extension === ".md");
  } catch (e) {
    // TypeError when filename is not a string
    return false;
  }
};
