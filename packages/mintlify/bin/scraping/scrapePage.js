import path from "path";
import { createPage, getOrigin } from "../util.js";
export async function scrapePage(scrapeFunc, href, html, overwrite) {
    const origin = getOrigin(href);
    const imageBaseDir = path.join(process.cwd(), "images");
    const { title, description, markdown } = await scrapeFunc(html, origin, process.cwd(), imageBaseDir);
    createPage(title, description, markdown, overwrite, process.cwd());
}
//# sourceMappingURL=scrapePage.js.map