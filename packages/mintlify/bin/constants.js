import path from "path";
import * as url from "url";
// package installation location
export const INSTALL_PATH = url.fileURLToPath(new URL(".", import.meta.url));
// command execution location
export const CMD_EXEC_PATH = process.cwd();
export const CLIENT_PATH = path.join(INSTALL_PATH, "mint", "client");
//# sourceMappingURL=constants.js.map