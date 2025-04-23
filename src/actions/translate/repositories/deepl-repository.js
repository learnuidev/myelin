const { translateTo } = require("../../../../lib/deepl/translate-to");
const { loadApiKey } = require("../utils/load-api-key");

const deepLRepository = () => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    let res = {};
    const apiKey = await loadApiKey({ config, targetLanguage });

    for (const keyVal of Object.entries(sourceTranslation)) {
      const [key, val] = keyVal;

      const resp = await translateTo({
        text: val,
        targetLang: targetLanguage,
        apiKey,
      });

      res[key] = resp;
    }

    return res;
  };

  return {
    translate,
  };
};

module.exports = {
  deepLRepository,
};
