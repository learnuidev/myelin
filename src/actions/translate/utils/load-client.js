const OpenAI = require("openai");

const { translationProviders } = require("../constants/translation-providers");
const { loadApiKey } = require("./load-api-key");

async function loadClient({ config, targetLanguage }) {
  // 1. validate if the provider is supported
  if (!config?.aiProviders && !translationProviders?.[config.aiProvider]) {
    throw new Error(
      `Only the following ai providers are supported: ${JSON.stringify(Object.values(translationProviders))}`
    );
  }
  const apiKey = await loadApiKey({ config, targetLanguage });

  const client = await ((provider) => {
    switch (provider) {
      case translationProviders.deepseek: {
        const client = new OpenAI({
          baseURL: "https://api.deepseek.com",
          apiKey: apiKey,
        });
        return client;
      }
      case translationProviders.moonshot: {
        const client = new OpenAI({
          baseURL: "https://api.moonshot.cn/v1",
          apiKey: apiKey,
        });
        return client;
      }
      case translationProviders.qwen: {
        const client = new OpenAI({
          baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
          apiKey: apiKey,
        });
        return client;
      }

      case translationProviders.mistral: {
        const client = new OpenAI({
          baseURL: "https://api.mistral.ai/v1",
          apiKey: apiKey,
        });
        return client;
      }

      case translationProviders.openai:
      default: {
        const client = new OpenAI({
          apiKey: apiKey,
        });
        return client;
      }
    }
  })(config?.aiProviders?.[targetLanguage]?.aiProvider || config?.aiProvider);

  return client;
}

module.exports = {
  loadClient,
};
