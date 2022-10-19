import inquirer from "inquirer";
import shell from "shelljs";
import { CLIENT_PATH } from "../../constants.js";

const clearCommand = async (args) => {
  const all = args?.a;
  shell.cd(CLIENT_PATH);
  shell.exec(
    `git clean -d -x ${all ? "" : "-e node_modules "}-e last-invocation-path -n`
  );
  await inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Clear the above directories?",
        default: true,
      },
    ])
    .then(({ confirm }) => {
      if (confirm) {
        shell.exec(
          `git clean -d -x ${
            all ? "" : "-e node_modules "
          }-e last-invocation-path -f`
        );
      } else {
        console.log("Clear cancelled.");
      }
    });
};

export default clearCommand;
