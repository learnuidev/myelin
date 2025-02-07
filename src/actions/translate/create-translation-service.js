const createTranslationService = (translationRepository) => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    const resp = await translationRepository.translate({
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
