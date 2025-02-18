const { createTranslationService } = require("../create-translation-service");
const { customRepository } = require("../repositories/custom-repository");
const { ollamaRepository } = require("../repositories/ollama-repository");
const { openAiRepository } = require("../repositories/openai-repository");

const getTranslationReposory = ({ config }) => {
  if (config.customAiUrl) {
    return customRepository();
  }

  if (config.aiProvider === "ollama") {
    return ollamaRepository();
  }

  return openAiRepository();
};

const translateText = async ({ sourceTranslation, config, targetLanguage }) => {
  const repository = getTranslationReposory({ config });

  const translationService = createTranslationService(repository);

  const response = await translationService.translate({
    sourceTranslation,
    config,
    targetLanguage,
  });

  return response;
};

module.exports = {
  translateText,
};
