import path from "path";
import downloadImage, {
  cleanImageSrc,
  isValidImageSrc,
  removeMetadataFromImageSrc,
} from "../downloadImage.js";
import { getFileExtension } from "../util.js";

// To Do: Use CheerioElement instead of any when we bump the cheerio version
export default async function downloadLogoImage(
  imageSrc: string,
  imageBaseDir: string,
  origin: string,
  overwrite: boolean
) {
  if (!isValidImageSrc(imageSrc)) return;

  const imageHref = cleanImageSrc(imageSrc, origin);

  const ext = getFileExtension(removeMetadataFromImageSrc(imageSrc));
  const imagePath = path.join(imageBaseDir, "logo", "logo-light-mode." + ext);

  await downloadImage(imageHref, imagePath, overwrite);
}
