import matter from "gray-matter";
import isAbsoluteUrl from "is-absolute-url";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import type { OpenApiFile } from "./types.js";

const createPage = async (
  pagePath: string,
  pageContent: string,
  contentDirectoryPath: string,
  openApiFiles: OpenApiFile[]
) => {
  let { data: metadata, content: fileContent } = matter(pageContent);
  try {
    const parsedContent = await preParseMdx(fileContent, contentDirectoryPath);
    fileContent = parsedContent;
  } catch (error) {
    fileContent = `🚧 A parsing error occured. Please contact the owner of this website.`;
  }

  // Replace .mdx so we can pass file paths into this function
  const slug = pagePath.replace(/\.mdx?$/, "");
  let defaultTitle = slugToTitle(slug);
  // Append data from OpenAPI if it exists
  const { title, description } = getOpenApiTitleAndDescription(
    openApiFiles,
    metadata?.openapi
  );

  if (title) {
    defaultTitle = title;
  }

  const pageMetadata = {
    title: defaultTitle,
    description,
    ...metadata,
    href: optionallyAddLeadingSlash(slug),
  };

  return {
    pageMetadata,
    fileContent,
    slug: removeLeadingSlash(slug),
  };
};

const preParseMdx = async (fileContent, contentDirectoryPath) => {
  const removeContentDirectoryPath = (filePath) => {
    const pathArr = createPathArr(filePath);
    const contentDirectoryPathArr = createPathArr(contentDirectoryPath);
    contentDirectoryPathArr.reverse().forEach((dir, index) => {
      if (pathArr[index] === dir) {
        pathArr.pop();
      }
    });
    return pathArr.join("/");
  };

  const removeContentDirectoryPaths = () => {
    return (tree) => {
      visit(tree, (node) => {
        if (node == null) {
          return;
        }
        if (node.name === "img" || node.name === "source") {
          const srcAttrIndex = node.attributes.findIndex(
            (attr) => attr?.name === "src"
          );
          const nodeUrl = node.attributes[srcAttrIndex].value;
          if (
            // <img/> component
            srcAttrIndex !== -1 &&
            !isAbsoluteUrl(nodeUrl) &&
            !isDataString(nodeUrl)
          ) {
            node.attributes[srcAttrIndex].value =
              removeContentDirectoryPath(nodeUrl);
          }
        } else if (
          // ![]() format
          node.type === "image" &&
          node.url &&
          !isAbsoluteUrl(node.url) &&
          !isDataString(node.url)
        ) {
          node.url = removeContentDirectoryPath(node.url);
        }
      });
      return tree;
    };
  };

  const file = await remark()
    .use(remarkMdx)
    .use(remarkGfm)
    .use(removeContentDirectoryPaths)
    .process(fileContent);
  return String(file);
};

const removeLeadingSlash = (str) => {
  const path = createPathArr(str);
  return path.join("/");
};

const createPathArr = (path) => {
  return path.split("/").filter((dir) => dir !== "");
};

const isDataString = (str) => str.startsWith("data:");

const getOpenApiTitleAndDescription = (openApiFiles, openApiMetaField) => {
  if (openApiFiles == null || !openApiMetaField || openApiMetaField == null) {
    return {};
  }

  const { operation } = getOpenApiOperationMethodAndEndpoint(
    openApiFiles,
    openApiMetaField
  );

  if (operation == null) {
    return {};
  }

  return {
    title: operation.summary,
    description: operation.description,
  };
};

const getOpenApiOperationMethodAndEndpoint = (
  openApiFiles,
  openApiMetaField
) => {
  const { endpoint, method, filename } =
    extractMethodAndEndpoint(openApiMetaField);

  let path;

  openApiFiles?.forEach((file) => {
    const openApiFile = file.spec;
    const openApiPath = openApiFile.paths && openApiFile.paths[endpoint];
    const isFilenameOrNone = !filename || filename === file.filename;
    if (openApiPath && isFilenameOrNone) {
      path = openApiPath;
    }
  });

  if (path == null) {
    return {};
  }

  let operation;
  if (method) {
    operation = path[method.toLowerCase()];
  } else {
    const firstOperationKey = Object.keys(path)[0];
    operation = path[firstOperationKey];
  }

  return {
    operation,
    method,
    endpoint,
  };
};

const extractMethodAndEndpoint = (openApiMetaField) => {
  const methodRegex = /(get|post|put|delete|patch)\s/i;
  const trimmed = openApiMetaField.trim();
  const foundMethod = trimmed.match(methodRegex);

  const startIndexOfMethod = foundMethod
    ? openApiMetaField.indexOf(foundMethod[0])
    : 0;
  const endIndexOfMethod = foundMethod
    ? startIndexOfMethod + foundMethod[0].length - 1
    : 0;

  const filename = openApiMetaField.substring(0, startIndexOfMethod).trim();

  return {
    method: foundMethod ? foundMethod[0].slice(0, -1).toUpperCase() : undefined,
    endpoint: openApiMetaField.substring(endIndexOfMethod).trim(),
    filename: filename ? filename : undefined,
  };
};

function optionallyAddLeadingSlash(path) {
  if (!path || path.startsWith("/")) {
    return path;
  }
  return "/" + path;
}

export const slugToTitle = (slug) => {
  const slugArr = slug.split("/");
  let defaultTitle = slugArr[slugArr.length - 1].split("-").join(" "); //replace all dashes
  defaultTitle = defaultTitle.split("_").join(" "); //replace all underscores
  defaultTitle = defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1); //capitalize first letter
  return defaultTitle;
};

export default createPage;
