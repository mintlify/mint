import inquirer from "inquirer";
import shell from "shelljs";
import { CLIENT_PATH } from "../../constants.js";

const clearCommand = () => {
  shell.cd(CLIENT_PATH);
  shell.exec("git clean -d -x -e node_modules -n");
  inquirer
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
        shell.exec("git clean -d -x -e node_modules -f");
      } else {
        console.log("Clear cancelled.");
      }
    });
};

export default clearCommand;
