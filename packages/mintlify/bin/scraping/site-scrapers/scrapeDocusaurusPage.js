import cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import downloadAllImages from "../downloadAllImages.js";
import replaceImagePaths from "../replaceImagePaths.js";
export async function scrapeDocusaurusPage(html, origin, cliDir, imageBaseDir) {
    const $ = cheerio.load(html);
    const content = $(".theme-doc-markdown").first();
    // Index pages with no additional text don't have the markdown class
    if (content.length === 0) {
        return {};
    }
    const titleComponent = content.find("h1");
    const title = titleComponent.text().trim();
    // Do not include title in the content when we insert it in our metadata
    titleComponent.remove();
    const origToWritePath = await downloadAllImages($, content, origin, imageBaseDir);
    const contentHtml = content.html();
    const nhm = new NodeHtmlMarkdown();
    let markdown = nhm.translate(contentHtml);
    // Description only exists in meta tags. The code is commented out because its prone to incorrectly
    // including a description if the first line of text had markdown annotations like `.
    // The commented out alternative is to ignore description if it's the first line of text,
    // this means it was not set in the metadata and Docusaurus defaulted to the text.
    const description = null;
    // let description = $('meta[property="og:description"]').attr("content");
    // if (markdown.startsWith(description)) {
    //   description = null;
    // }
    // Remove Docusaurus links from headers
    // When we parse their HTML the parser adds things like:
    // [](#setup "Direct link to heading")
    // to the end of each header.
    markdown = markdown.replace(/\[\]\(#.+ ".+"\)\n/g, "\n");
    // Remove unnecessary nonwidth blank space characters
    markdown = markdown.replace(/\u200b/g, "");
    // Reduce unnecessary blank lines
    markdown = markdown.replace(/\n\n\n/g, "\n\n");
    // Mintlify doesn't support bolded headers, remove the asterisks
    markdown = markdown.replace(/(\n#+) \*\*(.*)\*\*\n/g, "$1 $2\n");
    markdown = replaceImagePaths(origToWritePath, cliDir, markdown);
    return { title, description, markdown };
}
//# sourceMappingURL=scrapeDocusaurusPage.js.map