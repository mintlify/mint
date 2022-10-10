import inquirer from "inquirer";
import { writeFileSync } from "fs";
import { MintConfig } from "./templates.js";
import { createPage, toFilename } from "../util.js";

const initCommand = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the organization?",
      },
      {
        type: "input",
        name: "color",
        message: "What is the primary color of the brand?",
        default: "#3b83f4",
      },
      {
        type: "input",
        name: "ctaName",
        message: "What is the name of the call to action button?",
        default: "Get Started",
      },
      {
        type: "input",
        name: "ctaUrl",
        message: "What is the URL destination of the call to action button?",
        default: "/",
      },
      {
        type: "input",
        name: "title",
        message: "What is the title of the first page?",
        default: "Introduction",
      },
    ])
    .then((answers) => {
      const { name, color, ctaName, ctaUrl, title } = answers;
      writeFileSync(
        "mint.json",
        JSON.stringify(
          MintConfig(name, color, ctaName, ctaUrl, toFilename(title)),
          null,
          "\t"
        )
      );
      createPage(title);
      console.log("🌱 Created initial files for Mintlify docs");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

export default initCommand;
