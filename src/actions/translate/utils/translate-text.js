const { createTranslationService } = require("../create-translation-service");
const { customRepository } = require("../repositories/custom-repository");
const { ollamaRepository } = require("../repositories/ollama-repository");
const { openAiRepository } = require("../repositories/openai-repository");

const getTranslationRepository = ({ config, targetLanguage }) => {
  console.log("V1", targetLanguage);
  if (config.customAiUrl) {
    return customRepository();
  }

  if (config.aiProvider === "ollama") {
    return ollamaRepository();
  }

  return openAiRepository();
};
const getTranslationRepositoryV2 = ({ config, targetLanguage }) => {
  console.log("V2", targetLanguage);
  if (config.customAiUrl) {
    return customRepository();
  }

  if (config.aiProvider === "ollama") {
    return ollamaRepository();
  }

  return openAiRepository();
};

const translateText = async ({ sourceTranslation, config, targetLanguage }) => {
  const providerPerLang = config?.aiProviders?.[targetLanguage];
  const repository = providerPerLang
    ? getTranslationRepositoryV2({ config: providerPerLang, targetLanguage })
    : getTranslationRepository({ config });

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
