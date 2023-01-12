import { existsSync, mkdirSync, createWriteStream } from "fs";
import path from "path";
import axios from "axios";
import { getFileExtension } from "./util.js";
import { SUPPORTED_MEDIA_EXTENSIONS } from "./constants.js";

async function writeImageToFile(
  imageSrc: string,
  writePath: string,
  overwrite: boolean
) {
  // Avoid unnecessary downloads
  if (existsSync(writePath) && !overwrite) {
    return Promise.reject({
      code: "EEXIST",
    });
  }

  // Create the folders needed if they're missing
  mkdirSync(path.dirname(writePath), { recursive: true });

  const writer = createWriteStream(writePath);

  const response = await axios.get(imageSrc, {
    responseType: "stream",
  });

  // wx prevents overwriting an image with the exact same name
  // being created in the time we were downloading
  response.data.pipe(writer, {
    flag: "wx",
  });

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export function isValidImageSrc(src: string) {
  // We do not support downloading base64 in-line images.
  if (src.startsWith("data:")) {
    return false;
  }

  const imageHref = removeMetadataFromImageSrc(src);
  if (!SUPPORTED_MEDIA_EXTENSIONS.includes(getFileExtension(imageHref))) {
    console.error("Invalid image path " + imageHref);
    return false;
  }
  return true;
}

export function removeMetadataFromImageSrc(src: string) {
  // Part of the URL standard
  const metadataSymbols = ["?", "#"];

  metadataSymbols.forEach((dividerSymbol) => {
    // Some frameworks add metadata after the file extension, we need to remove that.
    src = src.split(dividerSymbol)[0];
  });

  return src;
}

export function cleanImageSrc(src: string, origin: string) {
  // Add origin if the image tags are using relative sources
  return src.startsWith("http") ? src : new URL(src, origin).href;
}

export default async function downloadImage(
  imageSrc: string,
  writePath: string,
  overwrite: boolean = false
) {
  await writeImageToFile(imageSrc, writePath, overwrite)
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
}
