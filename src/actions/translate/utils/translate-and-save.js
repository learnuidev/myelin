const { loadJsonFilesFromFolder } = require("./load-json-files-from-folder");
const { isFolder } = require("./is-folder");
const { writeJsonFile } = require("./write-json-file");

const { loadSourceTranslation } = require("./load-source-translation");

const { translateText } = require("./translate-text");

const translateAndSave = async ({ config }) => {
  // Flow for folder level
  const localeLocation = config.locale.location;
  const sourceLanguage = config.locale.sourceLanguage;

  const sourceFolderPath = `./${localeLocation}/${sourceLanguage}`;

  const _isFolder = await isFolder(`./${localeLocation}/${sourceLanguage}`);

  if (_isFolder) {
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);
    console.log("HANDLE FOLDER LEVEL TRANSLATION", sourceTranslations);

    await Promise.all(
      config.locale.targetLanguages.map(async (targetLanguage) => {
        await Promise.all(
          sourceTranslations?.map(async (sourceTranslationAndFileName) => {
            const { fileName, sourceTranslation } =
              sourceTranslationAndFileName;

            const translation = await translateText({
              sourceTranslation,
              config,
              targetLanguage,
            });

            await writeJsonFile(
              `./${localeLocation}/${targetLanguage}/${fileName}`,
              translation
            );
            return true;
          })
        );
      })
    );

    console.log(
      `Succcessfully translated the following languages: ${JSON.stringify(config.locale.targetLanguages)}`
    );

    return true;
  }

  // Flow for file level translation
  const sourceTranslation = await loadSourceTranslation({ config });

  await Promise.all(
    config.locale.targetLanguages.map(async (targetLanguage) => {
      const translation = await translateText({
        sourceTranslation,
        config,
        targetLanguage,
      });

      await writeJsonFile(
        `./${localeLocation}/${targetLanguage}.json`,
        translation
      );
      return true;
    })
  );

  console.log(
    `Succcessfully translated the following languages: ${JSON.stringify(config.locale.targetLanguages)}`
  );
};

module.exports = {
  translateAndSave,
};
