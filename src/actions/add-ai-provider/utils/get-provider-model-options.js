const {
  translationProviders,
} = require("../../translate/constants/translation-providers");

const getProviderModelOptions = (aiProvider) => {
  switch (aiProvider) {
    case translationProviders.mistral:
      return [
        { value: "mistral-saba-latest", label: "Mistral Saba" },
        { value: "mistral-large-latest", label: "Mistral Large" },
        { value: "ministral-3b-latest", label: "Ministral 3B" },
        { value: "ministral-8b-latest", label: "Ministral 8B" },
      ];
    case translationProviders.openai:
    default:
      return [
        { value: "o3-mini", label: "o3 Mini" },
        { value: "o1", label: "o1" },
        { value: "o1-mini", label: "o1 Mini" },
        { value: "gpt-4o", label: "GTP 4o" },
        { value: "gpt-4o-mini", label: "GTP 4o Mini" },
        { value: "gpt-3.5-turbo", label: "GPT 3.5 Turbo" },
      ];
    case translationProviders.claude:
      return [
        { value: "claude-3-5-sonnet-20241022", label: "Claude Sonnet 3.5 v2" },
        { value: "claude-3-7-sonnet-20250219", label: "Claude Sonnet 3.7" },
        { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      ];
    case translationProviders.deepseek:
      return [{ value: "deepseek-chat", label: "Deepseek Chat" }];
    case translationProviders.moonshot:
      return [
        { value: "moonshot-v1-8k", label: "Moonshot 8k" },
        { value: "moonshot-v1-32k", label: "Moonshot 32k" },
        { value: "moonshot-v1-128k", label: "Moonshot 128k" },
        { value: "moonshot-v1-audi", label: "Moonshot Auto" },
      ];
    case translationProviders.qwen:
      return [{ value: "qwen-plus", label: "Openai" }];
  }
};

module.exports = {
  getProviderModelOptions,
};
