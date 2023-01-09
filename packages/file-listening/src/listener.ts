import chokidar from "chokidar";
import fse from "fs-extra";
import pathUtil from "path";
import { fileBelongsInPagesFolder } from "./utils/fileBelongsInPagesFolder.js";
import openApiCheck from "./utils/openApiCheck.js";
import { createMetadataFile } from "./metadata.js";
import { CLIENT_PATH, CMD_EXEC_PATH } from "./constants.js";

const listener = () => {
  chokidar
    .watch(CMD_EXEC_PATH, {
      ignoreInitial: true,
      ignored: ["node_modules", ".git"],
      cwd: CMD_EXEC_PATH,
    })
    .on("all", async (event, filename) => {
      if (event === "unlink" || event === "unlinkDir") {
        if (fileBelongsInPagesFolder(filename)) {
          const targetPath = pathUtil.join(
            CLIENT_PATH,
            "src",
            "pages",
            filename
          );
          await fse.remove(targetPath);
          console.log("Page deleted: ", filename);
        } else if (
          filename === "mint.config.json" ||
          filename === "mint.json"
        ) {
          const targetPath = pathUtil.join(CLIENT_PATH, "src", "mint.json");
          await fse.remove(targetPath);
          console.log(
            "⚠️ mint.json deleted. Please create a new mint.json file as it is mandatory."
          );
          process.exit(1);
        } else {
          // all other files
          const targetPath = pathUtil.join(CLIENT_PATH, "public", filename);
          await fse.remove(targetPath);
          console.log("Static file deleted: ", filename);
        }
      } else {
        const filePath = pathUtil.join(CMD_EXEC_PATH, filename);
        let updateMetadata = false;
        if (fileBelongsInPagesFolder(filename)) {
          updateMetadata = true;
          const targetPath = pathUtil.join(
            CLIENT_PATH,
            "src",
            "pages",
            filename
          );
          await fse.copy(filePath, targetPath);
          switch (event) {
            case "add":
            case "addDir":
              console.log("New page detected: ", filename);
              break;
            default:
              console.log("Page edited: ", filename);
              break;
          }
        } else if (
          filename === "mint.config.json" ||
          filename === "mint.json"
        ) {
          updateMetadata = true;
          const targetPath = pathUtil.join(CLIENT_PATH, "src", "mint.json");
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
                JSON.stringify(openApiInfo.openapi),
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
          await createMetadataFile();
        }
      }
    });
};

export default listener;
