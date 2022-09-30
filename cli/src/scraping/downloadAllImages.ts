import path from "path";
import downloadImage from "../downloadImage.js";

// To Do: Use CheerioElement instead of any when we bump the cheerio version
export default async function downloadAllImages(
  $: any,
  content: any,
  origin: string,
  baseDir: string
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
        .map((src: string) =>
          // Add origin if the image tags are using relative sources
          src.startsWith("http") ? src : new URL(src, origin).href
        )
        .map((src: string) => {
          return removeFromExtension(src, "#");
        })
    ),
  ];

  // Wait to all images to download before continuing
  await Promise.all(
    imageSrcs.map((imageSrc: string) => {
      const fileName = removeFromExtension(path.basename(imageSrc), "?");

      if (!fileName) {
        console.error("Invalid image path " + imageSrc);
        return;
      }

      const writePath = path.join(baseDir, fileName);

      return downloadImage(imageSrc, writePath)
        .then(() => {
          console.log("🖼️ - " + writePath);
        })
        .catch((e) => {
          if (e.code === "EEXIST") {
            console.log(`❌ Skipping existing image ${writePath}`);
          } else {
            console.error(e);
          }
        });
    })
  );
}

function removeFromExtension(src, dividerSymbol) {
  // Some frameworks add metadata after the file extension with
  // a question mark before it, we need to remove that.
  const srcSplit = src.split(".");
  const fileExtension = srcSplit[srcSplit.length - 1];
  return (
    srcSplit.slice(0, -1).join(".") +
    "." +
    fileExtension.split(dividerSymbol)[0]
  );
}
