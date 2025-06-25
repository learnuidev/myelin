const { multiselect, note, outro } = require("@clack/prompts");
const { languageOptions } = require("../../constants/language-options");
const { loadConfig } = require("../translate/utils/load-config");
const {
  addAiProviderCli,
} = require("../add-ai-provider/utils/add-ai-provider-cli");
const { removeNull } = require("../../utils/remove-null");
const {
  addAiProviderSuccessLog,
} = require("../add-ai-provider/utils/add-ai-provider-success-log");
const picocolors = require("picocolors");

const addTargetLanguage = async () => {
  const config = await loadConfig();

  const allLangs = [
    config.locale.sourceLanguage,
    ...config.locale.targetLanguages,
  ];

  const targetLanguageOptions = languageOptions.filter(
    (option) => !allLangs?.includes(option.value)
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

  const { aiProviders } = await addAiProviderCli({
    targetLanguages,
  });

  const newConfig = removeNull({
    ...config,
    aiProviders: {
      ...config.aiProviders,
      ...aiProviders,
    },
    locale: {
      ...config.locale,
      targetLanguages: [...config.locale.targetLanguages, ...targetLanguages],
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
      `Target language: ${targetLanguages?.join(", ")} was added successfully!`
    )
  );

  note(
    `Run 'npx myelin.dev@latest translate' to start translating your files to the following target language(s): ${targetLanguages?.join(", ")}`,
    "Next: "
  );
};

module.exports = {
  addTargetLanguage,
};
