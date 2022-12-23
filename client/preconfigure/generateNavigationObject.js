import { promises as _promises } from 'fs';
import { pathExists } from 'fs-extra';
import { join } from 'path';

import { filterOutNullInGroup } from './utils';

const { readFile } = _promises;

export const generateNavigationObject = async (contentDirPath, navigation) => {
  if (!navigation || !Array.isArray(navigation) || navigation.length === 0) {
    return [];
  }
  const generatedNav = await Promise.all(
    navigation.map(async (navGroup) => {
      return {
        ...navGroup,
        pages: await generatePagesArray(contentDirPath, navGroup.pages),
      };
    })
  );

  return generatedNav.map((group) => {
    return filterOutNullInGroup(group);
  });
};

const generatePagesArray = async (contentDirPath, openApiFiles, navEntries) =>
  Promise.all(
    navEntries
      .map(async (entry) => {
        if (typeof entry === 'string') {
          return await findPageMetadata(contentDirPath, openApiFiles, entry);
        } else if (entry?.pages && Array.isArray(entry?.pages)) {
          return {
            ...entry,
            pages: await generatePagesArray(contentDirPath, openApiFiles, entry.pages),
          };
        }
        // TODO - better error handling
        return null;
      })
      .filter(Boolean)
  );
const findPageMetadata = async (contentDirPath, openApiFiles, entry) => {
  const entryPath = await getContentPath(contentDirPath, entry);
  if (!entryPath) {
    return null;
  }
  const fileContent = (await readFile(entryPath)).toString();
  const page = await extractMetadataFromContent(entryPath, fileContent, openApiFiles);
};

const extractMetadataFromContent = async (filename, content, openApiFiles) => {};

const getContentPath = async (contentDirPath, slug) => {
  let contentPath = undefined;
  if (await pathExists(join(contentDirPath, `${slug}.mdx`))) {
    contentPath = join(contentDirPath, `${slug}.mdx`);
  } else if (await pathExists(join(contentDirPath, `${slug}.md`))) {
    contentPath = join(contentDirPath, `${slug}.md`);
  }
  return contentPath;
};
