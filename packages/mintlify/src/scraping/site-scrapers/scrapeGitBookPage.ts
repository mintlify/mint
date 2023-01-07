import cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import downloadAllImages from "../downloadAllImages.js";
import replaceImagePaths from "../replaceImagePaths.js";

export async function scrapeGitBookPage(
  html: string,
  origin: string,
  cliDir: string,
  imageBaseDir: string,
  overwrite: boolean,
  _: string | undefined // version
) {
  const $ = cheerio.load(html);

  const titleComponent = $('[data-testid="page.title"]').first();
  const titleAndDescription = titleComponent.parent().parent().parent().text();

  const description = titleAndDescription
    .replace(titleComponent.text(), "")
    .trim();
  const title = titleComponent.text().trim();

  const content = $('[data-testid="page.contentEditor"]').first();
  const contentHtml = $.html(content);

  const modifyFileName = (fileName) =>
    // Remove GitBook metadata from the start
    // The first four %2F split metadata fields. Remaining ones are part of the file name.
    fileName.split("%2F").slice(4).join("%2F");

  const origToWritePath = await downloadAllImages(
    $,
    content,
    origin,
    imageBaseDir,
    overwrite,
    modifyFileName
  );

  const nhm = new NodeHtmlMarkdown({ useInlineLinks: false });
  let markdown = nhm.translate(contentHtml);

  // Keep headers on one line and increase their depth by one
  markdown = markdown.replace(/# \n\n/g, "## ");

  // Remove unnecessary nonwidth blank space characters
  markdown = markdown.replace(/\u200b/g, "");

  // Reduce unnecessary blank lines
  markdown = markdown.replace(/\n\n\n/g, "\n\n");

  // Mintlify doesn't support bolded headers, remove the asterisks
  markdown = markdown.replace(/(\n#+) \*\*(.*)\*\*\n/g, "$1 $2\n");

  markdown = replaceImagePaths(origToWritePath, cliDir, markdown);

  return { title, description, markdown };
}
