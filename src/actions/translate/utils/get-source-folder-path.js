const getSourceFolderPath = ({ config }) => {
  const localeLocation = config.locale.location;
  const sourceLanguage = config.locale.sourceLanguage;

  const sourceFolderPath = `./${localeLocation}/${sourceLanguage}`;

  return sourceFolderPath;
};

module.exports = {
  getSourceFolderPath,
};
