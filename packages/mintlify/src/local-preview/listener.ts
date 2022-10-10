import chokidar from "chokidar";
import fse from "fs-extra";
import path from "path";
import { CLIENT_PATH, CMD_EXEC_PATH } from "../constants.js";

const fileBelongsInPagesFolder = (filename: string) => {
  const extension =
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename;
  return (
    extension &&
    (extension === "mdx" || extension === "md" || extension === "tsx")
  );
};

const listener = () => {
  chokidar
    .watch(CMD_EXEC_PATH, {
      ignoreInitial: true,
      ignored: "node_modules",
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
        // TODO - add case for openapi
        // TODO - edit nav.json
      } else {
        const filePath = path.join(CMD_EXEC_PATH, filename);
        if (fileBelongsInPagesFolder(filename)) {
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
          // all other files
          const targetPath = path.join(CLIENT_PATH, "public", filename);
          await fse.copy(filePath, targetPath);
          switch (event) {
            case "add":
            case "addDir":
              console.log("Static file added: ", filename);
              break;
            default:
              console.log("Static file edited: ", filename);
              break;
          }
        }
      }
    });
};

export default listener;
