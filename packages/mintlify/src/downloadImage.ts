import { existsSync, mkdirSync, createWriteStream } from "fs";
import path from "path";
import axios from "axios";

async function downloadImageToFile(
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

export default async function downloadImage(
  imageSrc: string,
  writePath: string,
  overwrite: boolean = false
) {
  await downloadImageToFile(imageSrc, writePath, overwrite)
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
