#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

// node_modules/.pnpm/tsup@8.1.0_typescript@5.5.3/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// index.ts
var import_node_path = __toESM(require("path"));
var import_node_url = require("url");
var import_promises = require("fs/promises");
var import_child_process = require("child_process");
var import_util = require("util");
var import_glob = require("glob");
var import_picocolors = __toESM(require("picocolors"));
var import_prompts = __toESM(require("prompts"));
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");
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
function main() {
  return __async(this, null, function* () {
    const {
      _: [initialName]
    } = yield args.argv;
    const project = yield (0, import_prompts.default)(
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
      const { extras: results } = yield (0, import_prompts.default)({
        type: "multiselect",
        name: "extras",
        message: "Which extras would you like to add?",
        choices: EXTRAS[templateValue]
      });
      extras = results;
    }
    yield (0, import_promises.cp)(import_node_path.default.join(template, "project"), destination, { recursive: true });
    try {
      for (var iter = __forAwait(extras), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
        const extra = temp.value;
        yield (0, import_promises.cp)(import_node_path.default.join(template, "extras", extra), destination, { recursive: true });
      }
    } catch (temp) {
      error = [temp];
    } finally {
      try {
        more && (temp = iter.return) && (yield temp.call(iter));
      } finally {
        if (error)
          throw error[0];
      }
    }
    const files = yield (0, import_glob.glob)(`**/*`, { nodir: true, cwd: destination, absolute: true });
    try {
      for (var iter2 = __forAwait(files), more2, temp2, error2; more2 = !(temp2 = yield iter2.next()).done; more2 = false) {
        const file = temp2.value;
        const data = yield (0, import_promises.readFile)(file, "utf8");
        const draft = data.replace(/{{name}}/g, project.name);
        yield (0, import_promises.writeFile)(file, draft, "utf8");
      }
    } catch (temp2) {
      error2 = [temp2];
    } finally {
      try {
        more2 && (temp2 = iter2.return) && (yield temp2.call(iter2));
      } finally {
        if (error2)
          throw error2[0];
      }
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
        yield execAsync(`cd ${project.name}`);
        console.log(`
${import_picocolors.default.green(`cd`)} ${project.name}`);
      } catch (error3) {
        console.error(`Error executing commands: ${error3}`);
      }
    }
    try {
      console.log("Installing dependencies...");
      yield execAsync("pnpm install");
      yield execAsync("pnpm dev");
    } catch (error3) {
      console.error(`Error executing commands: ${error3}`);
    }
  });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map