const getProviderPerLang = ({ config, targetLanguage }) => {
  const providerPerLang = config?.aiProviders?.[targetLanguage];
  return providerPerLang;
};

module.exports = {
  getProviderPerLang,
};
