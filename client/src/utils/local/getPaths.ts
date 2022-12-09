import { getFileList, removeExtension, getPathsByExtension } from '@/utils/local/files';

export const getPaths = async (dirName: string) => {
  const files = await getFileList(dirName);
  const mdxFiles = getPathsByExtension(files, 'mdx', 'md');
  const extensionsRemoved = mdxFiles.map((file) => removeExtension(file));
  const pathArrs = extensionsRemoved.map((file) => {
    const arr = file.split('/');
    return arr.filter((dir) => dir !== '');
  });
  return pathArrs;
};
