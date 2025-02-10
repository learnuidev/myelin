const { select, note, multiselect, text, outro } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const { languageOptions } = require("../../constants/language-options");
const picocolors = require("picocolors");
const { removeNull } = require("../../utils/remove-null");
const {
  addAiProviderCli,
} = require("../add-ai-provider/utils/add-ai-provider-cli");
const {
  addAiProviderSuccessLog,
} = require("../add-ai-provider/utils/add-ai-provider-success-log");

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

  const syncType = await select({
    message: "Where do you want your frontend to load translations from",
    placeholder: "en",
    value: "local",
    validate: (value) => {
      if (!value) return "This value cannot be empty";
      return;
    },
    options: [
      { value: "local", label: "Local" },
      { value: "remote", label: "Remote" },
    ],
  });

  const { aiModel, aiProvider, customAiUrl } = await addAiProviderCli();

  const fs = await require("node:fs/promises");

  const config = removeNull({
    customAiUrl,
    aiProvider,
    aiModel,
    sync: {
      type: syncType,
    },
    locale: {
      location: localeLocation,
      sourceLanguage,
      targetLanguages,
    },
  });

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify(config, null, 2),
    "utf-8"
  );

  outro(picocolors.green("Configuration file created successfully!"));

  addAiProviderSuccessLog(config);

  note(`Run 'npx myelino translate' to start translating your files`, "Next: ");
};

module.exports = {
  init,
};
