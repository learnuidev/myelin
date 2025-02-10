const {
  getSourceFolderPath,
} = require("../translate/utils/get-source-folder-path");

const {
  loadJsonFilesFromFolder,
} = require("../translate/utils/load-json-files-from-folder");
const { loadTranslation } = require("../translate/utils/load-translation");
const crypto = require("crypto");

const listLocalTranslations = async ({ config }) => {
  const allLanguages = [
    config.locale.sourceLanguage,
    ...config.locale.targetLanguages,
  ];

  const sourceFolderPath = getSourceFolderPath({ config });

  const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);

  const localeLocation = config.locale.location;

  let translationsRes = [];

  for (let targetLanguage of allLanguages) {
    for (let sourceTranslationAndFileName of sourceTranslations || []) {
      const { fileName } = sourceTranslationAndFileName;
      const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

      let translations = await loadTranslation(fileLocation);

      translationsRes.push({
        id: `${crypto.randomUUID()}#${fileLocation}`,
        lang: targetLanguage,
        fileLocation,
        fileName,
        translations,
      });
    }
  }

  return translationsRes;
};

module.exports = {
  listLocalTranslations,
};
