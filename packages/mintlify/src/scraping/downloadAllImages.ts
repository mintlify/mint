import path from "path";
import downloadImage from "../downloadImage.js";

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
    imageSrcs.map(async (origImageSrc: string) => {
      // We do not support downloading base64 in-line images.
      if (origImageSrc.startsWith("data:")) {
        return undefined;
      }

      // Add origin if the image tags are using relative sources
      const imageHref = origImageSrc.startsWith("http")
        ? origImageSrc
        : new URL(origImageSrc, origin).href;

      let fileName = removeMetadataFromExtension(path.basename(imageHref));
      if (modifyFileName) {
        fileName = modifyFileName(fileName);
      }

      if (!fileName) {
        console.error("Invalid image path " + imageHref);
        return;
      }

      const writePath = path.join(baseDir, fileName);

      await downloadImage(imageHref, writePath, overwrite);

      return { [origImageSrc]: writePath };
    })
  );

  return origToNewArray.reduce(
    (result, current) => Object.assign(result, current),
    {}
  );
}

function removeMetadataFromExtension(src: string) {
  // Part of the URL standard
  const metadataSymbols = ["?", "#"];

  metadataSymbols.forEach((dividerSymbol) => {
    // Some frameworks add metadata after the file extension, we need to remove that.
    src = src.split(dividerSymbol)[0];
  });
  return src;
}
