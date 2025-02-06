#!/usr/bin/env node

const {
  intro,
  outro,
  select,
  text,
  isCancel,
  note,
  log,
} = require("@clack/prompts");
const picocolors = require("picocolors");
const {
  listDirectoryNames,
  getComponent,
  addComponent,
  translate,
  updateComponent,
  upsertComponent,
} = require("./actions");
const { myelin } = require("./constants/myelin");

// Import other required modules if needed

async function main() {
  let action;

  const [mainCommand, subCommand, ...args] = process.argv.slice(2);

  // console.log("main command", mainCommand);
  // console.log("SUB COMMAND", subCommand);

  if (mainCommand) {
    action = mainCommand;
  } else {
    note(myelin);
    intro(`Translate your app with Myelin AI.`);

    action = await select({
      message: "What would you like to do?",
      options: [
        { value: "init", label: "Initialize a new Myelin configuration" },
        { value: "translate", label: "Translate files" },
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
        const sourceLanguage = await select({
          message: "Enter your source language",
          placeholder: "en",
          options: [
            { value: "en", label: "English" },
            { value: "ro", label: "French" },
            { value: "es", label: "Spanish" },
            { value: "zh", label: "Chinese (Mainland)" },
            { value: "ro", label: "Romanian" },
          ],
        });

        const targetLanguages = await text({
          message: "Enter your target languages",
          placeholder: "fr, es, zh",
          validate: (value) => {
            if (!value) return "Please select at least one language";
            return;
          },
        });
        const localeLocation = await text({
          message: "Enter your locales location",
          placeholder: "locales",
          value: "locales",
          validate: (value) => {
            if (!value) return "Location cannot be empty";
            return;
          },
        });

        const aiProvider = await select({
          message: "Enter your ai provider",
          placeholder: "deepseek",
          options: [
            { value: "openai", label: "Openai" },
            { value: "deepseek", label: "Deepseek" },
            { value: "qwen", label: "Qwen" },
            { value: "moonshot", label: "Moonshot" },
          ],
        });

        const getPlaceholderModel = (aiProvider) => {
          switch (aiProvider) {
            case "openai":
            default:
              return "gpt-4o-mini";
            case "deepseek":
              return "deekseek-chat";
            case "moonshot":
              return "moonshot-v1-auto";
            case "qwen":
              return "qwen-plus";
          }
        };

        const getProviderModelOptions = (aiProvider) => {
          switch (aiProvider) {
            case "openai":
            default:
              return [
                { value: "o3-mini", label: "o3 Mini" },
                { value: "o1", label: "o1" },
                { value: "o1-mini", label: "o1 Mini" },
                { value: "gpt-4o", label: "GTP 4o" },
                { value: "gpt-4o-mini", label: "GTP 4o Mini" },
                { value: "gpt-3.5-turbo", label: "GPT 3.5 Turbo" },
              ];
            case "deepseek":
              return [{ value: "deepseek-chat", label: "Deepseek Chat" }];
            case "moonshot":
              return [
                { value: "moonshot-v1-8k", label: "Moonshot 8k" },
                { value: "moonshot-v1-32k", label: "Moonshot 32k" },
                { value: "moonshot-v1-128k", label: "Moonshot 128k" },
                { value: "moonshot-v1-audi", label: "Moonshot Auto" },
              ];
            case "qwen":
              return [{ value: "qwen-plus", label: "Openai" }];
          }
        };

        let aiModel = await select({
          message: "Enter your preferred ai model",
          placeholder: getPlaceholderModel(aiProvider),
          options: getProviderModelOptions(aiProvider),
        });

        const fs = await require("node:fs/promises");

        const config = {
          aiProvider,
          aiModel,
          locale: {
            location: localeLocation,
            sourceLanguage,
            targetLanguages: targetLanguages?.split(", "),
          },
        };

        await fs.writeFile(
          "myelin.config.json",
          JSON.stringify(config, null, 2),
          "utf-8"
        );

        outro(picocolors.green("Configuration file created successfully!"));

        note(
          `Run 'npx myelino translate' to start translating your files`,
          "Next: "
        );

        break;
      }
      case "list": {
        const dirPath = await text({
          message: "Enter directory path:",
          placeholder: process.cwd(),
        });

        if (isCancel(dirPath)) {
          outro("Operation cancelled");
          return process.exit(0);
        }

        const names = await listDirectoryNames(dirPath || process.cwd());
        console.log("\nDirectory contents:", names.join("\n"));
        break;
      }

      case "get": {
        const directoryPath = await text({
          message: "Enter directory path:",
          placeholder: "components",
        });

        const name = await text({
          message: "Enter component name:",
          placeholder: "no-lesson-view.tsx",
        });

        if (isCancel(directoryPath) || isCancel(name)) {
          outro("Operation cancelled");
          return process.exit(0);
        }

        const component = await getComponent({
          directoryPath: directoryPath || "components",
          name: name || "no-lesson-view.tsx",
        });
        console.log("\nComponent code:\n", component);
        break;
      }

      case "add": {
        let name;

        if (subCommand) {
          name = subCommand;
        } else {
          name = await text({
            message: "Enter component name:",
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
        console.log(`\nComponent ${name} added successfully!`);
        break;
      }

      case "update": {
        const name = await select({
          message: "Enter component name to update:",
          options: [
            { value: "animated-navbar", label: "animated-navbar" },
            { value: "animated-pill", label: "animated-pill" },
            { value: "animated-loading-text", label: "animated-loading-text" },
            { value: "the-dock", label: "the-dock" },
            { value: "leitner", label: "leitner" },
            { value: "leitner-ts", label: "leitner-ts" },
            {
              value: "copy-text-to-clipboard",
              label: "copy-text-to-clipboard",
            },
            {
              value: "copy-to-clipboard-button",
              label: "copy-to-clipboard-button",
            },
            {},
          ],
          validate: (value) => {
            if (!value) return "Component name is required!";
          },
        });

        if (isCancel(name)) {
          outro("Operation cancelled");
          return process.exit(0);
        }

        await updateComponent(name);
        console.log(`\nComponent ${name} updated successfully!`);
        break;
      }

      case "upsert": {
        const name = await select({
          message: "Enter component name to upsert:",
          options: [{ value: "i18next.d.ts", label: "i18next.d.ts" }],
          validate: (value) => {
            if (!value) return "Component name is required!";
          },
        });

        if (isCancel(name)) {
          outro("Operation cancelled");
          return process.exit(0);
        }

        await upsertComponent(name);
        console.log(`\nComponent ${name} upserted successfully!`);
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
