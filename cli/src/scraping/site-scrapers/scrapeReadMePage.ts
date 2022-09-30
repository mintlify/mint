import cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import downloadAllImages from "../downloadAllImages.js";
import replaceImagePaths from "../replaceImagePaths.js";

export async function scrapeReadMePage(
  html: string,
  origin: string,
  cliDir: string,
  imageBaseDir: string
) {
  const $ = cheerio.load(html);

  const titleComponent = $("h1").first();
  const title = titleComponent.text().trim();
  let description = $(".markdown-body", titleComponent.parent()).text().trim();
  if (!description) {
    description = $(".rm-Article > header p").text().trim();
  }

  let content = $(".content-body .markdown-body").first();
  if (content.length === 0) {
    content = $(".rm-Article > .markdown-body");
  }
  const contentHtml = content.html();

  const origToWritePath = await downloadAllImages(
    $,
    content,
    origin,
    imageBaseDir
  );

  const nhm = new NodeHtmlMarkdown();
  let markdown = nhm.translate(contentHtml);

  // Keep headers on one line and increase their depth by one
  markdown = markdown.replace(/# \n\n/g, "## ");

  // Remove unnecessary nonwidth blank space characters
  markdown = markdown.replace(/\u200b/g, "");

  // Remove ReadMe anchor links
  markdown = markdown.replace(/\n\[\]\(#.+\)\n/g, "\n");

  // Reduce unnecessary blank lines
  markdown = markdown.replace(/\n\n\n/g, "\n\n");

  // Mintlify doesn't support bolded headers, remove the asterisks
  markdown = markdown.replace(/(\n#+) \*\*(.*)\*\*\n/g, "$1 $2\n");

  markdown = replaceImagePaths(origToWritePath, cliDir, markdown);

  return { title, description, markdown };
}
