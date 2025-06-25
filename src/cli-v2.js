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
const {
  addCloudProvider,
} = require("./actions/add-cloud-provider/add-cloud-provider");
const { sync } = require("./actions/sync/sync");
const { addProject } = require("./actions/add-project/add-project");
const { loadConfig } = require("./actions/translate/utils/load-config");
const { addAiProvider } = require("./actions/add-ai-provider/add-ai-provider");
const { startUi } = require("./actions/start-ui/start-ui");
const { printStats } = require("./actions/print-stats/print-stats");
const { eat } = require("./actions/eat/eat");
const { clean } = require("./actions/clean/clean");
const { nsfy } = require("./actions/nsfy/nsfy");
const { cleanV2 } = require("./actions/translate/clean-v2");
const { low } = require("./actions/low/low");
const {
  addTargetLanguage,
} = require("./actions/add-target-language/add-target-language");
const {
  removeTargetLanguage,
} = require("./actions/remove-target-language/remove-target-language");

async function main() {
  let action;

  const [mainCommand, subCommand, ...args] = process.argv.slice(2);

  const subCommands = [subCommand, ...args]?.filter(Boolean);

  const config = await loadConfig({ throw: false });

  if (mainCommand) {
    action = mainCommand;
  } else {
    note(myelin);
    intro(`Translate your app with Myelin AI.`);

    let mainOptions = [
      { value: "init", label: "Initialize a new Myelin configuration" },
      { value: "add", label: "Add a component" },
      { value: "upsert", label: "Upsert a component" },
    ];

    if (config) {
      mainOptions = [
        { value: "translate", label: "Translate" },
        { value: "clean", label: "Remove unused keys" },
        { value: "eat", label: "EAT" },
        { value: "low", label: "Line of words" },
        { value: "nsfy", label: "Namespacefy files" },
        { value: "sync", label: "Sync" },
        { value: "stats", label: "Stats about your translations" },
        { value: "add-project", label: "Add a new project" },
        { value: "add-cloud", label: "Add a cloud provider" },
        { value: "add-ai", label: "Add a AI provider" },
        { value: "add-lang", label: "Add a target language(s)" },
        { value: "remove-lang", label: "Remove a target language(s)" },
        { value: "start-ui", label: "Start an interactive ui" },
      ].concat(mainOptions);
    }

    action = await select({
      message: "What would you like to do?",
      options: mainOptions,
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
      case "sync": {
        await sync(subCommand || "up");
        break;
      }
      case "eat": {
        await eat(subCommand);
        break;
      }

      case "add-cloud": {
        await addCloudProvider();
        break;
      }
      case "start-ui": {
        await startUi();
        break;
      }
      case "add-ai": {
        await addAiProvider();
        break;
      }
      case "add-lang":
      case "add-language": {
        await addTargetLanguage();
        break;
      }
      case "remove-lang":
      case "remove-language": {
        await removeTargetLanguage();
        break;
      }

      case "add-project": {
        await addProject();
        break;
      }
      case "stats": {
        await printStats(subCommands);
        break;
      }
      case "nsfy": {
        await nsfy(subCommands);
        break;
      }
      case "clean": {
        // await clean(subCommands);
        await cleanV2(subCommands);
        break;
      }

      case "low": {
        await low(subCommands);
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
              { value: "myelin-ui", label: "myelin ui" },
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
              {
                value: "blog",
                label: "blog",
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

        await addComponent(name, args?.[0]);
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
        await translate(subCommands);
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
