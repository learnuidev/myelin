const { translateTo } = require("../../../../lib/google/translate-to");
const { loadApiKey } = require("../utils/load-api-key");

const googleRepository = () => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    let res = {};
    const xApiKey = await loadApiKey({ config, targetLanguage });

    for (const keyVal of Object.entries(sourceTranslation)) {
      const [key, val] = keyVal;

      const resp = await translateTo({
        text: val,
        targetLang: targetLanguage,
        xApiKey,
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
  googleRepository,
};
