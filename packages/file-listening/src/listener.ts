import chokidar from "chokidar";
import fse from "fs-extra";
import pathUtil from "path";
import { fileIsMdxOrMd } from "./utils/fileIsMdxOrMd.js";
import { openApiCheck } from "./utils.js";
import { updateGeneratedNav, updateFile } from "./update.js";
import { CLIENT_PATH, CMD_EXEC_PATH } from "./constants.js";
import { promises as _promises } from "fs";
import createPage from "./utils/createPage.js";

const { readFile } = _promises;

const listener = () => {
  chokidar
    .watch(CMD_EXEC_PATH, {
      ignoreInitial: true,
      ignored: ["node_modules", ".git"],
      cwd: CMD_EXEC_PATH,
    })
    .on("all", async (event, filename) => {
      if (event === "unlink" || event === "unlinkDir") {
        if (fileIsMdxOrMd(filename)) {
          const targetPath = pathUtil.join(
            CLIENT_PATH,
            "src",
            "_props",
            filename
          );
          await fse.remove(targetPath);
          console.log("Page deleted: ", filename);
        } else if (filename === "mint.json") {
          const targetPath = pathUtil.join(
            CLIENT_PATH,
            "src",
            "_props",
            "mint.json"
          );
          await fse.remove(targetPath);
          console.log(
            "⚠️ mint.json deleted. Please create a new mint.json file as it is mandatory."
          );
          process.exit(1);
        } else {
          // TODO: Account for openapi.json, snippets
          // all other files
          const targetPath = pathUtil.join(CLIENT_PATH, "public", filename);
          await fse.remove(targetPath);
          console.log("Static file deleted: ", filename);
        }
      } else {
        const filePath = pathUtil.join(CMD_EXEC_PATH, filename);
        let updateMetadata = false;
        if (fileIsMdxOrMd(filename)) {
          const targetPath = pathUtil.join(
            CLIENT_PATH,
            "src",
            "_props",
            filename
          );
          if (filename.startsWith("_snippets")) {
            await updateFile(CMD_EXEC_PATH, targetPath, filename);
            return;
          }
          updateMetadata = true;

          const contentStr = (await readFile(filePath)).toString();
          const { fileContent } = await createPage(
            filename,
            contentStr,
            CMD_EXEC_PATH,
            []
          );
          await fse.outputFile(targetPath, fileContent, {
            flag: "w",
          });
          switch (event) {
            case "add":
            case "addDir":
              console.log("New page detected: ", filename);
              break;
            default:
              console.log("Page edited: ", filename);
              break;
          }
        } else if (filename === "mint.json") {
          updateMetadata = true;
          const targetPath = pathUtil.join(
            CLIENT_PATH,
            "src",
            "_props",
            "mint.json"
          );
          await fse.copy(filePath, targetPath);
          switch (event) {
            case "add":
            case "addDir":
              console.log("Config added");
              break;
            default:
              console.log("Config edited");
              break;
          }
        } else {
          const extension = pathUtil.parse(filename).ext.slice(1);
          let isOpenApi = false;
          if (
            extension &&
            (extension === "json" ||
              extension === "yaml" ||
              extension === "yml")
          ) {
            const openApiInfo = await openApiCheck(
              pathUtil.join(CMD_EXEC_PATH, filename)
            );
            isOpenApi = openApiInfo.isOpenApi;
            if (isOpenApi) {
              await fse.outputFile(
                pathUtil.join(CLIENT_PATH, "src", "openapi.json"),
                JSON.stringify(openApiInfo.spec),
                {
                  flag: "w",
                }
              );
              updateMetadata = true;
            }
          }
          if (!isOpenApi) {
            // all other files
            const targetPath = pathUtil.join(CLIENT_PATH, "public", filename);
            await fse.copy(filePath, targetPath);
          }
          switch (event) {
            case "add":
            case "addDir":
              if (isOpenApi) {
                console.log("OpenApi file added: ", filename);
              } else {
                console.log("Static file added: ", filename);
              }
              break;
            default:
              if (isOpenApi) {
                console.log("OpenApi file edited: ", filename);
              } else {
                console.log("Static file edited: ", filename);
              }
              break;
          }
        }
        if (updateMetadata) {
          // TODO: Instead of re-generating the entire nav, optimize by just updating the specific page that changed.
          await updateGeneratedNav();
        }
      }
    });
};

export default listener;
