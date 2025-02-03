const { loadJsonFilesFromFolder } = require("./load-json-files-from-folder");
const { isFolder } = require("./is-folder");
const { writeJsonFile } = require("./write-json-file");

const { loadSourceTranslation } = require("./load-source-translation");

const { translateText } = require("./translate-text");
const { loadTranslation } = require("./load-translation");

const smartTranslateAndSave = async ({
  fileLocation,
  sourceTranslation,
  config,
  targetLanguage,
  fileName,
}) => {
  // 1. First check if existing translations exist
  const existingTranslation = await loadTranslation(fileLocation);

  // 2. If not found then proceed with normal translation
  if (!existingTranslation) {
    const translation = await translateText({
      sourceTranslation,
      config,
      targetLanguage,
    });

    await writeJsonFile(fileLocation, translation);
    return true;
  }

  // 3. If found, then create a new source translation by filtering out the already existing ones
  const newSourceTranslation = Object.fromEntries(
    Object.entries(sourceTranslation).filter((translationKeyAndValue) => {
      const [translationKey] = translationKeyAndValue;
      return !existingTranslation?.[translationKey];
    })
  );
  // 4. If there is no need to translate then, log saying: nothing to translate
  if (!Object.keys(newSourceTranslation)?.length) {
    console.log(`Nothing to translate in: ${fileName} [${targetLanguage}] 😪`);
    return null;
  }

  console.log(
    `😃 - Translating the following for: ${targetLanguage} [${fileLocation}]: `,
    newSourceTranslation
  );

  // 5: Otherwise translate new translations and save new translations with
  const translation = await translateText({
    sourceTranslation: newSourceTranslation,
    config,
    targetLanguage,
  });

  const newTranslation = {
    ...existingTranslation,
    ...translation,
  };

  console.log(
    `🎉 - Successfully translated for: ${targetLanguage}. Saving it in the path: ${fileLocation}`,
    newTranslation
  );

  await writeJsonFile(fileLocation, newTranslation);
  return true;
};

const translateAndSave = async ({ config }) => {
  // Flow for folder level
  const localeLocation = config.locale.location;
  const sourceLanguage = config.locale.sourceLanguage;

  const sourceFolderPath = `./${localeLocation}/${sourceLanguage}`;

  const _isFolder = await isFolder(sourceFolderPath);

  // Flow for folder level translation
  if (_isFolder) {
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);
    console.log("HANDLE FOLDER LEVEL TRANSLATION", sourceTranslations);

    await Promise.all(
      config.locale.targetLanguages.map(async (targetLanguage) => {
        await Promise.all(
          sourceTranslations?.map(async (sourceTranslationAndFileName) => {
            const { fileName, sourceTranslation } =
              sourceTranslationAndFileName;
            const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

            // await writeJsonFile(fileLocation, newTranslation);
            await smartTranslateAndSave({
              fileLocation,
              sourceTranslation,
              config,
              targetLanguage,
              fileName,
            });

            return true;
          })
        );
      })
    );

    console.log(
      `Succcessfully translated the following languages: ${JSON.stringify(config.locale.targetLanguages)}`
    );
  }

  // Flow for file level translation
  let sourceTranslation;

  try {
    sourceTranslation = await loadSourceTranslation({ config });
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    sourceTranslation = null;
  }

  if (!sourceTranslation) {
    return null;
  }

  await Promise.all(
    config.locale.targetLanguages.map(async (targetLanguage) => {
      const fileLocation = `./${localeLocation}/${targetLanguage}.json`;

      await smartTranslateAndSave({
        fileLocation,
        sourceTranslation,
        config,
        targetLanguage,
        fileName: targetLanguage,
      });

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
