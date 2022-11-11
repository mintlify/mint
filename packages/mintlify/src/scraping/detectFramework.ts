import cheerio from "cheerio";

export enum Frameworks {
  DOCUSAURUS = "DOCUSAURUS",
  GITBOOK = "GITBOOK",
  README = "README",
}

export function detectFramework(html) {
  const $ = cheerio.load(html);
  const docusaurusMeta = $('meta[name="generator"]');

  if (
    docusaurusMeta.length > 0 &&
    docusaurusMeta.attr("content").includes("Docusaurus")
  ) {
    if (docusaurusMeta.attr("content").includes("v3")) {
      return { framework: Frameworks.DOCUSAURUS, version: "3" };
    }
    if (docusaurusMeta.attr("content").includes("v2")) {
      return { framework: Frameworks.DOCUSAURUS, version: "2" };
    } else if (docusaurusMeta.attr("content").includes("v1")) {
      console.warn(
        "WARNING: We detected Docusaurus version 1 but we only support scraping versions 2 and 3."
      );
      return { framework: Frameworks.DOCUSAURUS, version: "1" };
    }
  }

  const isGitBook = $(".gitbook-root").length > 0;
  if (isGitBook) {
    return { framework: Frameworks.GITBOOK };
  }

  const isReadMe = $('meta[name="readme-deploy"]').length > 0;
  if (isReadMe) {
    return { framework: Frameworks.README };
  }

  return undefined;
}
