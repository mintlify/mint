import shell from "shelljs";
import { CLIENT_PATH } from "../../constants.js";

const installDeps = async () => {
  shell.cd(CLIENT_PATH);
  shell.exec("yarn");
};

export default installDeps;
