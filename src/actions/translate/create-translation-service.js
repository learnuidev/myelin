const createTranslationService = (translationRepository) => {
  const translate = async ({
    fileLocation,
    sourceTranslation,
    config,
    targetLanguage,
  }) => {
    const resp = await translationRepository.translate({
      fileLocation,
      sourceTranslation,
      config,
      targetLanguage,
    });

    return resp;
  };

  return {
    translate,
  };
};

module.exports = {
  createTranslationService,
};
