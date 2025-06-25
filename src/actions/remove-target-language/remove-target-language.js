const { multiselect, outro, select } = require("@clack/prompts");
const { languageOptions } = require("../../constants/language-options");
const { loadConfig } = require("../translate/utils/load-config");
const { removeNull } = require("../../utils/remove-null");
const {
  addAiProviderSuccessLog,
} = require("../add-ai-provider/utils/add-ai-provider-success-log");
const picocolors = require("picocolors");
const {
  getTranslationsFolderPath,
} = require("../translate/utils/get-translations-folder-path");
const { removeDirectory } = require("../../../lib/fs/remove-directory");

const removeTargetLanguage = async () => {
  const config = await loadConfig();

  const targetLanguageOptions = languageOptions.filter((option) =>
    config.locale.targetLanguages?.includes(option.value)
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

  const aiProviders = Object.fromEntries(
    Object.entries(config.aiProviders).filter(
      (item) => !targetLanguages?.includes(item[0])
    )
  );

  const newConfig = removeNull({
    ...config,
    aiProviders: aiProviders,
    locale: {
      ...config.locale,
      targetLanguages: [
        ...config.locale.targetLanguages.filter(
          (lang) => !targetLanguages?.includes(lang)
        ),
      ],
    },
  });

  const fs = await require("node:fs/promises");

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify({ ...newConfig }, null, 2),
    "utf-8"
  );

  if (config.aiProvider !== "ollama") {
    addAiProviderSuccessLog(config, targetLanguages);
  }

  outro(
    picocolors.green(
      `Target language: ${targetLanguages?.join(", ")} was removed successfully!`
    )
  );

  const removeTranslations = await select({
    message: `Would you like to remove all the translations for: ${targetLanguages?.join(", ")}`,
    placeholder: "yes",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  });

  if (removeTranslations === "yes") {
    for (const targetLang of targetLanguages) {
      const folderPath = await getTranslationsFolderPath({
        config,
        lang: targetLang,
      });

      await removeDirectory(folderPath);
    }

    outro(
      picocolors.green(
        `Translations for: ${targetLanguages?.join(", ")} was removed successfully!`
      )
    );
  }
};

module.exports = {
  removeTargetLanguage,
};
