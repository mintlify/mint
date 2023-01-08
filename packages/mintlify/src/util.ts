import { mkdirSync, writeFileSync } from "fs";
import Ora from "ora";
import path from "path";
import shell from "shelljs";
import stopIfInvalidLink from "./validation/stopIfInvalidLink.js";

export const MintConfig = (
  name: string,
  color: string,
  ctaName: string,
  ctaUrl: string,
  filename: string
) => {
  return {
    name,
    logo: "",
    favicon: "",
    colors: {
      primary: color,
    },
    topbarLinks: [],
    topbarCtaButton: {
      name: ctaName,
      url: ctaUrl,
    },
    anchors: [],
    navigation: [
      {
        group: "Home",
        pages: [filename],
      },
    ],
    // footerSocials: {}, // support object type for footer tyoes
  };
};

export const Page = (
  title: string,
  description?: string,
  markdown?: string
) => {
  // If we are an empty String we want to add two quotes,
  // if we added as we went we would detect the first quote
  // as the closing quote.
  const startsWithQuote = title.startsWith('"');
  const endsWithQuote = title.startsWith('"');
  if (!startsWithQuote) {
    title = '"' + title;
  }
  if (!endsWithQuote) {
    title = title + '"';
  }

  const optionalDescription = description
    ? `\ndescription: "${description}"`
    : "";
  return `---\ntitle: ${title}${optionalDescription}\n---\n\n${markdown}`;
};

export function getOrigin(url: string) {
  // eg. https://google.com -> https://google.com
  // https://google.com/page -> https://google.com
  return new URL(url).origin;
}

export function objToReadableString(objs: MintNavigationEntry[]) {
  // Two spaces as indentation
  return objs.map((obj) => JSON.stringify(obj, null, 2)).join(",\n");
}

export const toFilename = (title: string) => {
  // Gets rid of special characters at the start and end
  // of the name by converting to spaces then using trim.
  return title
    .replace(/[^a-z0-9]/gi, " ")
    .trim()
    .replace(/ /g, "-")
    .toLowerCase();
};

export const addMdx = (fileName: string) => {
  if (fileName.endsWith(".mdx")) {
    return fileName;
  }
  return fileName + ".mdx";
};

export const createPage = (
  title: string,
  description?: string,
  markdown?: string,
  overwrite: boolean = false,
  rootDir: string = "",
  fileName?: string
) => {
  const writePath = path.join(rootDir, addMdx(fileName || toFilename(title)));

  // Create the folders needed if they're missing
  mkdirSync(rootDir, { recursive: true });

  // Write the page to memory
  if (overwrite) {
    writeFileSync(writePath, Page(title, description, markdown));
    console.log("✏️ - " + writePath);
  } else {
    try {
      writeFileSync(writePath, Page(title, description, markdown), {
        flag: "wx",
      });
      console.log("✏️ - " + writePath);
    } catch (e) {
      // We do a try-catch instead of an if-statement to avoid a race condition
      // of the file being created after we started writing.
      if (e.code === "EEXIST") {
        console.log(`❌ Skipping existing file ${writePath}`);
      } else {
        console.error(e);
      }
    }
  }
};

export function getHrefFromArgs(argv: any) {
  const href = argv.url;
  stopIfInvalidLink(href);
  return href;
}

export const buildLogger = (startText: string = "") => {
  const logger = Ora().start(startText);
  return logger;
};

export const getFileExtension = (filename: string) => {
  return (
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename
  );
};

export const fileBelongsInPagesFolder = (filename: string) => {
  const extension = getFileExtension(filename);
  return (
    extension &&
    (extension === "mdx" || extension === "md" || extension === "tsx")
  );
};

export const ensureYarn = (logger: any) => {
  const yarnInstalled = shell.which("yarn");
  if (!yarnInstalled) {
    logger.fail(`yarn must be installed, run

    npm install --global yarn

    `);
    process.exit(1);
  }
};
