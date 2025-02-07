const { loadXApiKey } = require("../utils/load-x-api-key");

const customRepository = () => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    const xApiKey = await loadXApiKey({ config });
    const resp = await fetch(config?.customAiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xApiKey,
      },
      body: JSON.stringify({ sourceTranslation, targetLanguage }),
    });

    const respJson = await resp.json();

    return respJson;
  };

  return {
    translate,
  };
};

module.exports = {
  customRepository,
};
