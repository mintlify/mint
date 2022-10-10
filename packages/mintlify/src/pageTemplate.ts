import inquirer from "inquirer";
import { createPage } from "./util.js";

const generatePageTemplate = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new page?",
      },
      {
        type: "input",
        name: "description",
        message: "What is the description?",
        default: "",
      },
    ])
    .then((answers) => {
      const { title, description } = answers;

      createPage(title, description);
      console.log("🌱 Created initial files for Mintlify docs");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

export default generatePageTemplate;
