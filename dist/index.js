#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/tsup@8.0.1_typescript@5.3.3/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// index.ts
var import_node_path = __toESM(require("path"));
var import_node_url = require("url");
var import_promises = require("fs/promises");
var import_glob = require("glob");
var import_picocolors = __toESM(require("picocolors"));
var import_prompts = __toESM(require("prompts"));
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");
var import_child_process = require("child_process");
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var EXTRAS = {
  "next-eslint-ts-shadcn": [
    {
      title: "Clerk Auth",
      value: "clerk"
    },
    {
      title: "Auth0",
      value: "auth0"
    },
    {
      title: "Supabase",
      value: "supabase"
    },
    {
      title: "libSQL + Drizzle",
      value: "libsql"
    }
  ]
};
var args = (0, import_yargs.default)((0, import_helpers.hideBin)(process.argv)).options({
  name: {
    alias: "n",
    type: "string",
    description: "Name of the project"
  }
});
import_prompts.default.override(args.argv);
async function main() {
  const {
    _: [initialName]
  } = await args.argv;
  const project = await (0, import_prompts.default)(
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
        }
      }
    ],
    {
      onCancel: () => {
        console.log("\nBye \u{1F44B}\n");
        process.exit(0);
      }
    }
  );
  const templateValue = "next-eslint-ts-shadcn";
  const template = import_node_path.default.join(
    import_node_path.default.dirname((0, import_node_url.fileURLToPath)(importMetaUrl)),
    "templates",
    templateValue
  );
  const destination = project.name === "." ? process.cwd() : import_node_path.default.join(process.cwd(), project.name);
  let extras = [];
  if (EXTRAS[templateValue]) {
    const { extras: results } = await (0, import_prompts.default)({
      type: "multiselect",
      name: "extras",
      message: "Which extras would you like to add?",
      choices: EXTRAS[templateValue]
    });
    extras = results;
  }
  await (0, import_promises.cp)(import_node_path.default.join(template, "project"), destination, { recursive: true });
  for await (const extra of extras) {
    await (0, import_promises.cp)(import_node_path.default.join(template, "extras", extra), destination, { recursive: true });
  }
  const files = await (0, import_glob.glob)(`**/*`, { nodir: true, cwd: destination, absolute: true });
  for await (const file of files) {
    const data = await (0, import_promises.readFile)(file, "utf8");
    const draft = data.replace(/{{name}}/g, project.name);
    await (0, import_promises.writeFile)(file, draft, "utf8");
  }
  console.log("\n\u2728 Project created \u2728");
  if (extras.length) {
    console.log(
      `
Check out ${import_picocolors.default.italic(
        extras.map((extra) => `${extra.toUpperCase()}.md`).join(", ")
      )} for more info on how to use it.`
    );
  }
  if (project.name !== ".") {
    try {
      process.chdir(project.name);
      console.log(`
${import_picocolors.default.green(`cd`)} ${project.name}`);
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
  console.log("\n---\n");
  console.log(`Questions \u{1F440}? ${import_picocolors.default.underline(import_picocolors.default.cyan("https://x.com/goncy"))}`);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map