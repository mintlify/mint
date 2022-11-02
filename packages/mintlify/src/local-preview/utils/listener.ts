import chokidar from "chokidar";
import fse from "fs-extra";
import path from "path";
import { CLIENT_PATH, CMD_EXEC_PATH } from "../../constants.js";
import { fileBelongsInPagesFolder, getFileExtension } from "../../util.js";
import { createMetadataFile } from "./metadata.js";
import openApiCheck from "./openApiCheck.js";

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
          const targetPath = path.join(CLIENT_PATH, "src", "pages", filename);
          await fse.remove(targetPath);
          console.log("Page deleted: ", filename);
        } else if (
          filename === "mint.config.json" ||
          filename === "mint.json"
        ) {
          const targetPath = path.join(CLIENT_PATH, "src", "mint.json");
          await fse.remove(targetPath);
          console.log(
            "⚠️ mint.json deleted. Please create a new mint.json file as it is mandatory."
          );
          process.exit(1);
        } else {
          // all other files
          const targetPath = path.join(CLIENT_PATH, "public", filename);
          await fse.remove(targetPath);
          console.log("Static file deleted: ", filename);
        }
      } else {
        const filePath = path.join(CMD_EXEC_PATH, filename);
        let updateMetadata = false;
        if (fileBelongsInPagesFolder(filename)) {
          updateMetadata = true;
          const targetPath = path.join(CLIENT_PATH, "src", "pages", filename);
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
          const targetPath = path.join(CLIENT_PATH, "src", "mint.json");
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
          const extension = getFileExtension(filename);
          let isOpenApi = false;
          if (
            extension &&
            (extension === "json" ||
              extension === "yaml" ||
              extension === "yml")
          ) {
            const openApiInfo = await openApiCheck(
              path.join(CMD_EXEC_PATH, filename)
            );
            isOpenApi = openApiInfo.isOpenApi;
            if (isOpenApi) {
              await fse.outputFile(path.join(CLIENT_PATH, "src", "openapi.json"), Buffer.from(openApiInfo.buffer), {
                flag: "w",
              });
              updateMetadata = true;
            }
          }
          if (!isOpenApi) { // all other files
            const targetPath = path.join(CLIENT_PATH, "public", filename);
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
