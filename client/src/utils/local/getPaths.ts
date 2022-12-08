import { getFileList, getExtension, removeExtension } from '@/utils/local/files';

export const getPaths = async (dirName: string) => {
  const files = await getFileList(dirName);
  const mdxFiles = files.filter((file) => {
    const extension = getExtension(file);
    return extension === 'mdx' || extension === 'md';
  });
  const extensionsRemoved = mdxFiles.map((file) => removeExtension(file));
  const pathArrs = extensionsRemoved.map((file) => {
    const arr = file.split('/');
    return arr.filter((dir) => dir !== '');
  });
  return pathArrs;
};
