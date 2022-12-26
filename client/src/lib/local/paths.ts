import { pathExists } from 'fs-extra';

import { getFileList, getPathsByExtension, removeExtension } from './utils';

export const getPaths = async (
  dirName: string
): Promise<
  {
    params: {
      slug: string[];
    };
  }[]
> => {
  if (!(await pathExists(dirName))) {
    return [];
  }
  const files = await getFileList(dirName);
  const mdxFiles = getPathsByExtension(files, 'mdx', 'md');
  const extensionsRemoved = mdxFiles.map((file) => removeExtension(file));
  const pathArrs = extensionsRemoved.map((file) => {
    const arr = file.split('/');
    return arr.filter((dir) => dir !== '');
  });
  return pathArrs.map((arr) => {
    return {
      params: {
        slug: arr,
      },
    };
  });
};
