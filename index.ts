#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { cp, readFile, writeFile } from "node:fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

import { cyan, green, red } from "picocolors";
import { glob } from "glob";
import color from "picocolors";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { install } from "./helpers/install";
const execAsync = promisify(exec);

// Define the templates available
const TEMPLATES = [
  {
    title: "Nextjs ts with db setup Landing",
    value: "nextjs-ts-landing",
  },
  {
    title: 'Nextjs ts clean',
    value: 'nextjs-ts-clean'
  }
];

// Specify CLI arguments
const args = yargs(hideBin(process.argv)).options({
  name: {
    alias: "n",
    type: "string",
    description: "Name of the project",
  },
  template: {
    alias: "t",
    type: "string",
    description: "Template to use",
  },
});

// Override arguments passed on the CLI
prompts.override(args.argv);

async function main() {
  // Get the initial values for the prompts
  const {
    _: [initialName, initialProject],
  } = await args.argv;

  // Create the project prompt
  const project = await prompts(
    [
      {
        type: "text",
        name: "name",
        message: "What is the name of your project?",
        initial: initialName || "apppaaaul-project",
        validate: (value) => {
          if (value !== "." && value.match(/[^a-zA-Z0-9-_]+/g)) {
            return "Project name can only contain letters, numbers, dashes, underscores, or be '.' for the current directory";
          }

          return true;
        },
      },
      {
        type: "select",
        name: "template",
        message: `Which template would you like to use?`,
        initial: initialProject || 0,
        choices: TEMPLATES,
      },
    ],
    {
      onCancel: () => {
        console.log("\nBye 👋\n");

        process.exit(0);
      },
    },
  );

  // Get the template folder for the selected template
  const template = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "templates",
    project.template,
  );

  // Get the destination folder for the project
  const destination = project.name === "." ? process.cwd() : path.join(process.cwd(), project.name);

  // Copy files from the template folder to the current directory
  await cp(path.join(template, "project"), destination, { recursive: true });

  // Get all files from the destination folder
  const files = await glob(`**/*`, { nodir: true, cwd: destination, absolute: true });

  // Read each file and replace the tokens
  for await (const file of files) {
    const data = await readFile(file, "utf8");
    const draft = data.replace(/{{name}}/g, project.name);

    await writeFile(file, draft, "utf8");
  }

  // Log outro message
  console.log("\n✨ Project created ✨");

  // Run commands if a new directory was created
  if (project.name !== ".") {
    try {
      await execAsyc(`cd ${project.name}`);
      console.log(`\n${color.green(`cd`)} ${project.name}`);
    } catch (error) {
      console.error(`Error executing commands: ${error}`);
    }
  }
  try {
    await execAsync("code .");
    console.log("Installing packages. This might take a couple of minutes.");
    console.log();
    await install();
    console.log();
    console.log(`${green("Success!")} App installed successfully.`);
    console.log(cyan("Initializing the development server..."));
    //TODO: Add docker-compose up, docker create db, pnpm run db:push
    await execAsync("pnpm dev");
  } catch (error) {
    console.error(`Error executing commands: ${error}`);
  }
}

// Run the main function
main().catch(console.error);
