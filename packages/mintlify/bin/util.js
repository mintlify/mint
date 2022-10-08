import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { Page } from "./templates.js";
export function getOrigin(url) {
    // eg. https://google.com -> https://google.com
    // https://google.com/page -> https://google.com
    return new URL(url).origin;
}
export function objToReadableString(objs) {
    // Two spaces as indentation
    return objs.map((obj) => JSON.stringify(obj, null, 2)).join(",\n");
}
export const toFilename = (title) => {
    // Gets rid of special characters at the start and end
    // of the name by converting to spaces then using trim.
    return title
        .replace(/[^a-z0-9]/gi, " ")
        .trim()
        .replace(/ /g, "-")
        .toLowerCase();
};
export const addMdx = (fileName) => {
    if (fileName.endsWith(".mdx")) {
        return fileName;
    }
    return fileName + ".mdx";
};
export const createPage = (title, description, markdown, overwrite = false, rootDir = "", fileName) => {
    const writePath = path.join(rootDir, addMdx(fileName || toFilename(title)));
    // Create the folders needed if they're missing
    mkdirSync(rootDir, { recursive: true });
    // Write the page to memory
    if (overwrite) {
        writeFileSync(writePath, Page(title, description, markdown));
        console.log("✏️ - " + writePath);
    }
    else {
        try {
            writeFileSync(writePath, Page(title, description, markdown), {
                flag: "wx",
            });
            console.log("✏️ - " + writePath);
        }
        catch (e) {
            // We do a try-catch instead of an if-statement to avoid a race condition
            // of the file being created after we started writing.
            if (e.code === "EEXIST") {
                console.log(`❌ Skipping existing file ${writePath}`);
            }
            else {
                console.error(e);
            }
        }
    }
};
//# sourceMappingURL=util.js.map