const { createTranslationService } = require("../create-translation-service");
const { customRepository } = require("../repositories/custom-repository");
const { openAiRepository } = require("../repositories/openai-repository");

const translateText = async ({ sourceTranslation, config, targetLanguage }) => {
  const repository = config.customAiUrl
    ? customRepository()
    : openAiRepository();

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
