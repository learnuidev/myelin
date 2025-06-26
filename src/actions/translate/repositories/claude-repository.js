const { translateTo } = require("../../../../lib/claude/translate-to");
const { loadApiKey } = require("../utils/load-api-key");

const claudeRepository = () => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    const apiKey = await loadApiKey({ config, targetLanguage });

    const resp = await translateTo({
      sourceTranslation,
      targetLanguage,
      apiKey,
      model: config?.aiProviders?.[targetLanguage]?.aiModel || config.aiModel,
    });

    return resp;
  };

  return {
    translate,
  };
};

module.exports = {
  claudeRepository,
  // deepLRepository,
};
