const { select, note, multiselect, text, outro } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const { languageOptions } = require("../../constants/language-options");
const picocolors = require("picocolors");

const init = async () => {
  const configExists = await loadConfig();

  let confirm;

  if (configExists) {
    confirm = await select({
      message:
        "Config already exists, are you sure you want to continue. Continuing will overwrite the old version!",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    });
  }

  if (confirm === "no") {
    note("Goodbye");
    return;
  }

  const sourceLanguage = await select({
    message: "Enter your source language",
    placeholder: "en",
    options: languageOptions,
  });

  const targetLanguageOptions = languageOptions.filter(
    (option) => option.value !== sourceLanguage
  );

  const targetLanguages = await multiselect({
    message:
      "Enter your target languages (press space bar to select / unselect languages)",
    options: targetLanguageOptions,
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
      targetLanguages,
    },
  };

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify(config, null, 2),
    "utf-8"
  );

  outro(picocolors.green("Configuration file created successfully!"));

  note(`Run 'npx myelino translate' to start translating your files`, "Next: ");
};

module.exports = {
  init,
};
