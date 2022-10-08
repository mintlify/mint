import { existsSync, mkdirSync, createWriteStream } from "fs";
import path from "path";
import axios from "axios";
export default async function downloadImage(imageSrc, writePath) {
    // Avoid unnecessary downloads
    if (existsSync(writePath)) {
        return Promise.reject({
            code: "EEXIST",
        });
    }
    // Create the folders needed if they're missing
    mkdirSync(path.dirname(writePath), { recursive: true });
    const writer = createWriteStream(writePath);
    const response = await axios.default.get(imageSrc, {
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
//# sourceMappingURL=downloadImage.js.map