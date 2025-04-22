const {
  translationProviders,
} = require("../../translate/constants/translation-providers");

const getPlaceholderModel = (aiProvider) => {
  switch (aiProvider) {
    case translationProviders.openai:
    default:
      return "gpt-4o-mini";
    case translationProviders.deepseek:
      return "deekseek-chat";
    case translationProviders.moonshot:
      return "moonshot-v1-auto";
    case translationProviders.qwen:
      return "qwen-plus";
  }
};

module.exports = {
  getPlaceholderModel,
};
