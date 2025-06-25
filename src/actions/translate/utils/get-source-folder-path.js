const { getTranslationsFolderPath } = require("./get-translations-folder-path");

const getSourceFolderPath = ({ config }) => {
  const sourceLanguage = config.locale.sourceLanguage;

  const sourceFolderPath = getTranslationsFolderPath({
    config,
    lang: sourceLanguage,
  });

  return sourceFolderPath;
};

module.exports = {
  getSourceFolderPath,
};
