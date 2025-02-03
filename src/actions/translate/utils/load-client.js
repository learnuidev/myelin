const OpenAI = require("openai");

const { translationProviders } = require("../constants/translation-providers");
const { loadApiKey } = require("./load-api-key");

async function loadClient({ config }) {
  // 1. validate if the provider is supported
  if (!translationProviders?.[config.aiProvider]) {
    throw new Error(
      `Only the following ai providers are supported: ${JSON.stringify(Object.values(translationProviders))}`
    );
  }
  const apiKey = await loadApiKey();

  const client = await (() => {
    switch (config?.aiProvider) {
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

      case translationProviders.openai:
      default: {
        const client = new OpenAI({
          apiKey: apiKey,
        });
        return client;
      }
    }
  })();

  return client;
}

module.exports = {
  loadClient,
};
