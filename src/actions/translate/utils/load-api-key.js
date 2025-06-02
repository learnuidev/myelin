const { translationProviders } = require("../constants/translation-providers");
const { getProviderPerLang } = require("./get-provider-per-lang");

/* eslint-disable no-undef */
require("dotenv").config();

async function loadApiKeyLegacy({ config }) {
  const aiApiKey = process.env.AI_API_KEY;

  if (!aiApiKey) {
    throw new Error(
      `API Key for ${config.aiProvider} not found. Please add AI_API_KEY in your .env file and try again :)`
    );
  }

  return aiApiKey;
}

async function loadApiKey({ config, targetLanguage }) {
  const providerPerLang = getProviderPerLang({ config, targetLanguage });

  if (providerPerLang) {
    const aiApiKeyProperty = (() => {
      switch (providerPerLang.aiProvider) {
        case translationProviders.openai:
          return "OPENAI_API_KEY";
        case translationProviders.deepseek:
          return "DEEPSEEK_API_KEY";
        case translationProviders.qwen:
          return "QWEN_API_KEY";
        case translationProviders.mistral:
          return "MISTRAL_API_KEY";
        case translationProviders.moonshot:
          return "MOONSHOT_API_KEY";
        case translationProviders.claude:
          return "CLAUDE_API_KEY";
        case translationProviders.google:
          return "GOOGLE_API_KEY";
        case translationProviders.deepl:
          return "DEEPL_API_KEY";
      }
    })();

    const aiApiKey = process.env?.[aiApiKeyProperty];

    if (!aiApiKey) {
      throw new Error(
        `API Key for ${providerPerLang.aiProvider} not found. Please add ${aiApiKeyProperty} in your .env file and try again :)`
      );
    }

    return aiApiKey;
  }

  return loadApiKeyLegacy({ config });
}

module.exports = {
  loadApiKey,
};
