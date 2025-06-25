const getTranslationsFolderPath = ({ config, lang }) => {
  const localeLocation = config.locale.location;

  const sourceFolderPath = `./${localeLocation}/${lang}`;

  return sourceFolderPath;
};

module.exports = {
  getTranslationsFolderPath,
};
