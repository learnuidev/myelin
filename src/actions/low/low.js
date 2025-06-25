const { note } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadJsonFilesFromFolder,
} = require("../translate/utils/load-json-files-from-folder");
const {
  getTranslationsFolderPath,
} = require("../translate/utils/get-translations-folder-path");

const getTotalTranslations = (sourceTranslations) => {
  const allTranslations = sourceTranslations
    ?.map((trans) => Object.values(trans.sourceTranslation).join(" "))
    .join(" ")
    ?.split(" ");

  const uniqueTranslations = [...new Set(allTranslations)];

  const stats = {
    lineOfWords: {
      total: allTranslations?.length,
      unique: uniqueTranslations?.length,
    },
  };

  return stats;
};

// eslint-disable-next-line no-unused-vars
const low = async (subCommands) => {
  // step 1: read config
  const config = await loadConfig();

  if (!config) {
    note(
      "myelin.config.json not found. Please run `npx myelino` to create one",
      "Error"
    );
    return null;
  }

  const allLangs = [
    config.locale.sourceLanguage,
    ...config.locale.targetLanguages,
  ];

  let res = {};

  for (let lang of allLangs) {
    const folterPath = await getTranslationsFolderPath({ config, lang });

    const translations = await loadJsonFilesFromFolder(folterPath);

    const stats = getTotalTranslations(translations);

    res[lang] = stats;
  }

  console.log(res);
};

module.exports = {
  low,
};
