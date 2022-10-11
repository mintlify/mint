import path from "path";
import * as url from "url";
import os from "os";

// package installation location
export const INSTALL_PATH = url.fileURLToPath(new URL(".", import.meta.url));

export const HOME_DIR = os.homedir();

export const DOT_MINTLIFY = path.join(HOME_DIR, ".mintlify");

export const CLIENT_PATH = path.join(DOT_MINTLIFY, "mint", "client");

// command execution location
export const CMD_EXEC_PATH = process.cwd();

export const LAST_INVOCATION_PATH_FILE_LOCATION = path.join(
  CLIENT_PATH,
  "last-invocation-path"
);
