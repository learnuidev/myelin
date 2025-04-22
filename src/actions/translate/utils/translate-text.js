const { createTranslationService } = require("../create-translation-service");
const { customRepository } = require("../repositories/custom-repository");
const { ollamaRepository } = require("../repositories/ollama-repository");
const { openAiRepository } = require("../repositories/openai-repository");
const { getProviderPerLang } = require("./get-provider-per-lang");

const getTranslationRepository = ({ config }) => {
  if (config.customAiUrl) {
    return customRepository();
  }

  if (config.aiProvider === "ollama") {
    return ollamaRepository();
  }

  return openAiRepository();
};
const getTranslationRepositoryV2 = ({ config, targetLanguage }) => {
  const providerPerLang = getProviderPerLang({ config, targetLanguage });

  if (providerPerLang.customAiUrl) {
    return customRepository();
  }

  if (providerPerLang.aiProvider === "ollama") {
    return ollamaRepository();
  }

  return openAiRepository();
};

const translateText = async ({ sourceTranslation, config, targetLanguage }) => {
  const providerPerLang = getProviderPerLang({ config, targetLanguage });

  if (config.logMode) {
    console.log("provider: ", providerPerLang);
  }

  const repository = providerPerLang
    ? getTranslationRepositoryV2({ config, targetLanguage })
    : getTranslationRepository({ config, targetLanguage });

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
