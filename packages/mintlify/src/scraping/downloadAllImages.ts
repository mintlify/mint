import path from "path";
import downloadImage, {
  cleanImageSrc,
  isValidImageSrc,
  removeMetadataFromImageSrc,
} from "../downloadImage.js";

// To Do: Use CheerioElement instead of any when we bump the cheerio version
export default async function downloadAllImages(
  $: any,
  content: any,
  origin: string,
  baseDir: string,
  overwrite: boolean,
  modifyFileName?: any
) {
  if (!baseDir) {
    console.debug("Skipping image downloading");
    return;
  }

  // We remove duplicates because some frameworks duplicate img tags
  // to show the image larger when clicked on.
  const imageSrcs = [
    ...new Set(
      content
        .find("img[src]")
        .map((i, image) => $(image).attr("src"))
        .toArray()
    ),
  ];

  // Wait to all images to download before continuing
  const origToNewArray = await Promise.all(
    imageSrcs.map(async (imageSrc: string) => {
      if (!isValidImageSrc(imageSrc)) return;

      const imageHref = cleanImageSrc(imageSrc, origin);

      let fileName = removeMetadataFromImageSrc(path.basename(imageHref));
      if (modifyFileName) {
        fileName = modifyFileName(fileName);
      }

      const writePath = path.join(baseDir, fileName);

      await downloadImage(imageHref, writePath, overwrite);

      return { [imageSrc]: writePath };
    })
  );

  return origToNewArray.reduce(
    (result, current) => Object.assign(result, current),
    {}
  );
}
