import shell from "shelljs";
import { CLIENT_PATH } from "../../constants.js";
import { buildLogger, ensureYarn } from "../../util.js";

const installDeps = async () => {
  const logger = buildLogger("");
  ensureYarn(logger);
  shell.cd(CLIENT_PATH);
  shell.exec("yarn");
  logger.succeed("Dependencies installed.");
};

export default installDeps;
