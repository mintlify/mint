import cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import downloadAllImages from "../downloadAllImages.js";

export async function scrapeGitBookPage(
  html: string,
  origin: string,
  imageBaseDir: string
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

  await downloadAllImages($, content, origin, imageBaseDir);

  const nhm = new NodeHtmlMarkdown();
  let markdown = nhm.translate(contentHtml);

  // Keep headers on one line and increase their depth by one
  markdown = markdown.replace(/# \n\n/g, "## ");

  // Remove unnecessary nonwidth blank space characters
  markdown = markdown.replace(/\u200b/g, "");

  // Reduce unnecessary blank lines
  markdown = markdown.replace(/\n\n\n/g, "\n\n");

  // Mintlify doesn't support bolded headers, remove the asterisks
  markdown = markdown.replace(/(\n#+) \*\*(.*)\*\*\n/g, "$1 $2\n");

  return { title, description, markdown };
}
