const { translationProviders } = require("../constants/translation-providers");
const { createTranslationService } = require("../create-translation-service");
const { customRepository } = require("../repositories/custom-repository");
const { deepLRepository } = require("../repositories/deepl-repository");
const { googleRepository } = require("../repositories/google-repository");
const { ollamaRepository } = require("../repositories/ollama-repository");
const { openAiRepository } = require("../repositories/openai-repository");
// const { openAiRepositoryV2 } = require("../repositories/openai-repository-v2");
const { getProviderPerLang } = require("./get-provider-per-lang");

const getTranslationRepository = (config) => {
  if (config.customAiUrl) {
    return customRepository();
  }

  if (config.aiProvider === translationProviders.ollama) {
    return ollamaRepository();
  }

  if (config.aiProvider === translationProviders.google) {
    return googleRepository();
  }

  if (config.aiProvider === translationProviders.deepl) {
    return deepLRepository();
  }

  return openAiRepository();
};
const getTranslationRepositoryV2 = ({ config, targetLanguage }) => {
  const providerPerLang = getProviderPerLang({ config, targetLanguage });

  return getTranslationRepository(providerPerLang);
};

const translateText = async ({
  fileLocation,
  sourceTranslation,
  config,
  targetLanguage,
}) => {
  const providerPerLang = getProviderPerLang({ config, targetLanguage });

  if (config.logMode) {
    console.log("provider: ", providerPerLang);
  }

  const repository = providerPerLang
    ? getTranslationRepositoryV2({ config, targetLanguage })
    : getTranslationRepository(config);

  const translationService = createTranslationService(repository);

  const response = await translationService.translate({
    fileLocation,
    sourceTranslation,
    config,
    targetLanguage,
  });

  return response;
};

module.exports = {
  translateText,
};
