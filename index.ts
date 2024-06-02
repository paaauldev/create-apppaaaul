#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { cp, readFile, writeFile } from "node:fs/promises";
import { glob } from "glob";
import color from "picocolors";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// List of extras
const EXTRAS = {
  "next-eslint-ts-shadcn": [
    {
      title: "Clerk Auth",
      value: "clerk",
    },
    {
      title: "Auth0",
      value: "auth0",
    },
    {
      title: "Supabase",
      value: "supabase",
    },
    {
      title: "libSQL + Drizzle",
      value: "libsql",
    },
  ],
};

// Specify CLI arguments
const args = yargs(hideBin(process.argv)).options({
  name: {
    alias: "n",
    type: "string",
    description: "Name of the project",
  },
});

// Override arguments passed on the CLI
prompts.override(args.argv);

async function main() {
  // Get the initial values for the prompts
  const {
    _: [initialName],
  } = await args.argv;

  // Create the project prompt
  const project = await prompts(
    [
      {
        type: "text",
        name: "name",
        message: "What is the name of your project?",
        initial: initialName || "appncy-project",
        validate: (value) => {
          if (value !== "." && value.match(/[^a-zA-Z0-9-_]+/g)) {
            return "Project name can only contain letters, numbers, dashes, underscores, or be '.' for the current directory";
          }
          return true;
        },
      },
    ],
    {
      onCancel: () => {
        console.log("\nBye 👋\n");

        process.exit(0);
      },
    }
  );

  // Predefined template
  const templateValue = "next-eslint-ts-shadcn";

  // Get the template folder for the selected template
  const template = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "templates",
    templateValue
  );

  // Get the destination folder for the project
  const destination = project.name === "." ? process.cwd() : path.join(process.cwd(), project.name);

  // Get the extras for the selected template
  let extras = [];

  if (EXTRAS[templateValue]) {
    const { extras: results } = await prompts({
      type: "multiselect",
      name: "extras",
      message: "Which extras would you like to add?",
      choices: EXTRAS[templateValue],
    });

    // Assign to variable
    extras = results;
  }

  // Copy files from the template folder to the current directory
  await cp(path.join(template, "project"), destination, { recursive: true });

  for await (const extra of extras) {
    // Copy files from the extra folder to the current directory
    await cp(path.join(template, "extras", extra), destination, { recursive: true });
  }

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
  console.log(`\n${color.yellow(`Next steps:`)}\n`);

  // Determine the next steps based on the destination
  if (project.name !== ".") {
    console.log(`${color.green(`cd`)} ${project.name}`);
  }
  console.log(`${color.green(`pnpm`)} install`);
  console.log(`${color.green(`pnpm`)} dev`);

  // Extras log
  if (extras.length) {
    console.log(
      `\nCheck out ${color.italic(
        extras.map((extra) => `${extra.toUpperCase()}.md`).join(", ")
      )} for more info on how to use it.`
    );
  }

  // Run commands if a new directory was created
  if (project.name !== ".") {
    try {
      process.chdir(destination);
      console.log(`\n${color.green(`cd`)} ${destination}`);
      await execAsync("pnpm install");
      await execAsync("pnpm dev");
    } catch (error) {
      console.error(`Error executing commands: ${error}`);
    }
  } else {
    try {
      await execAsync("pnpm install");
      await execAsync("pnpm dev");
    } catch (error) {
      console.error(`Error executing commands: ${error}`);
    }
  }

  // Contact logs
  console.log("\n---\n");
  console.log(`Questions 👀? ${color.underline(color.cyan("https://x.com/goncy"))}`);
}

// Run the main function
main().catch(console.error);
