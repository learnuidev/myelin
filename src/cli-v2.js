#!/usr/bin/env node

const {
  intro,
  outro,
  select,
  isCancel,
  note,

  log,
} = require("@clack/prompts");

const { addComponent, translate, upsertComponent, init } = require("./actions");
const { myelin } = require("./constants/myelin");

async function main() {
  let action;

  const [mainCommand, subCommand, ...args] = process.argv.slice(2);

  if (mainCommand) {
    action = mainCommand;
  } else {
    note(myelin);
    intro(`Translate your app with Myelin AI.`);

    action = await select({
      message: "What would you like to do?",
      options: [
        { value: "init", label: "Initialize a new Myelin configuration" },
        { value: "translate", label: "Translate" },
        // { value: "list", label: "List directory contents" },
        // { value: "get", label: "Get a component" },
        { value: "add", label: "Add a component" },
        { value: "upsert", label: "Upsert a component" },
      ],
    });
  }

  if (isCancel(action)) {
    outro("Operation cancelled");
    return process.exit(0);
  }

  try {
    switch (action) {
      case "init": {
        await init();
        break;
      }

      case "add": {
        let name;

        if (subCommand) {
          name = subCommand;
        } else {
          name = await select({
            message: "Add a component:",
            options: [
              { value: "i18next", label: "i18next" },
              { value: "animated-navbar", label: "animated-navbar" },
              { value: "animated-pill", label: "animated-pill" },
              {
                value: "animated-loading-text",
                label: "animated-loading-text",
              },
              { value: "the-dock", label: "the-dock" },
              { value: "leitner", label: "leitner" },
              { value: "leitner-ts", label: "leitner-ts" },
              {
                value: "copy-to-clipboard",
                label: "copy-to-clipboard",
              },
              {
                value: "copy-to-clipboard-button",
                label: "copy-to-clipboard-button",
              },
            ],
            validate: (value) => {
              if (!value) return "Component name is required!";
            },
          });
        }

        if (isCancel(name)) {
          outro("Operation cancelled");
          return process.exit(0);
        }

        await addComponent(name);
        break;
      }

      case "upsert": {
        let name;

        const upsertOptions = [
          { value: "i18next.d.ts", label: "i18next.d.ts" },
        ];

        const upsertValidationFn = (value) => {
          if (!value) return "Component name is required!";
        };

        if (subCommand) {
          name = subCommand;
        } else {
          name = await select({
            message: "Enter component name to upsert:",
            options: upsertOptions,
            validate: upsertValidationFn,
          });
        }

        if (!["i18next.d.ts"]?.includes(name)) {
          name = await select({
            message: "Invalid name. Please select one of the following: ",
            options: upsertOptions,
            validate: upsertValidationFn,
          });
        }

        if (isCancel(name)) {
          outro("Operation cancelled");
          return process.exit(0);
        }

        await upsertComponent(name);
        break;
      }

      case "translate": {
        await translate();
        log.success("Translation completed successfully!");
        break;
      }
    }
  } catch (error) {
    outro(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
