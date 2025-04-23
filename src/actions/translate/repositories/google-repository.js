const { translateTo } = require("../../../../lib/google/translate-to");
const { loadApiKey } = require("../utils/load-api-key");
const { loadTranslation } = require("../utils/load-translation");
const { writeJsonFile } = require("../utils/write-json-file");

const googleRepository = () => {
  const translate = async ({
    fileLocation,
    sourceTranslation,
    config,
    targetLanguage,
  }) => {
    let originalExistingTranslation = await loadTranslation(fileLocation);

    let res = {
      ...originalExistingTranslation,
    };
    const xApiKey = await loadApiKey({ config, targetLanguage });

    for (const keyVal of Object.entries(sourceTranslation)) {
      const [key, val] = keyVal;

      const resp = await translateTo({
        text: val,
        targetLang: targetLanguage,
        xApiKey,
      });

      res[key] = resp;

      await writeJsonFile(fileLocation, res);
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
