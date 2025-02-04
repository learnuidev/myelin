const { loadJsonFilesFromFolder } = require("./load-json-files-from-folder");
const { isFolder } = require("./is-folder");
const { writeJsonFile } = require("./write-json-file");

const { loadSourceTranslation } = require("./load-source-translation");

const { translateText } = require("./translate-text");
const { loadTranslation } = require("./load-translation");
const { structuredDiff } = require("./git/structured-diff");

const smartTranslateAndSave = async ({
  fileLocation,
  sourceTranslation,
  config,
  targetLanguage,
  fileName,
}) => {
  // 1. First check if existing translations exist
  let existingTranslation = await loadTranslation(fileLocation);

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

  // 3.5. Handle deletion of keys
  const existingTranslationWithRemovedKeys = Object.fromEntries(
    Object.entries(existingTranslation).filter((translationKeyAndValue) => {
      const [translationKey] = translationKeyAndValue;
      return !sourceTranslation?.[translationKey];
    })
  );

  // 4. If there is no need to translate then, log saying: nothing to translate
  if (!Object.keys(newSourceTranslation)?.length) {
    console.log(`Nothing to translate in: ${fileName} [${targetLanguage}] 😪`);

    const _structuredDiff = await structuredDiff();

    // console.log("STRUCTURED", JSON.stringify(_structuredDiff, null, 4));

    const changedFile = _structuredDiff?.find((file) =>
      file?.file?.includes(
        `${config?.locale?.location}/${config?.locale?.sourceLanguage}/${fileName}`
      )
    );

    if (changedFile) {
      const newKeys = changedFile?.changes?.map((change) => change?.key);
      console.log(
        `🧹 - Editing the following keys: ${JSON.stringify(newKeys)} for: ${targetLanguage} from: ${fileLocation}`,
        existingTranslationWithRemovedKeys
      );

      const editedSourceTranslation = changedFile?.changes?.reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr?.key]: curr?.newValue,
          };
        },
        {}
      );

      // console.log("EDITED", editedSourceTranslation);
      // console.log("LOCATION", fileLocation);

      const edited = await translateText({
        sourceTranslation: editedSourceTranslation,
        config,
        targetLanguage,
      });

      existingTranslation = {
        ...existingTranslation,
        ...edited,
      };

      console.log(
        `🎉 - Successfully edited the keys  ${JSON.stringify(newKeys)} for: ${targetLanguage}. Saving it in the path: ${fileLocation}.`
      );

      console.log(`Edited new keys`);
      // console.log("FILE CHANGED", changedFile);
      // const keysChanged = changedFile?.changes?.map((change) => change?.key);
      // console.log("KEYS CHANGED", keysChanged);
    }

    const changedFileStandAlone = _structuredDiff?.find((file) =>
      file?.file?.includes(
        `${config?.locale?.location}/${config?.locale?.sourceLanguage}.json`
      )
    );

    if (changedFileStandAlone && fileLocation?.split("/")?.length === 3) {
      const newKeys = changedFileStandAlone?.changes?.map(
        (change) => change?.key
      );
      console.log(
        `🧹 - Editing the following keys: ${JSON.stringify(newKeys)} for: ${targetLanguage} from: ${fileLocation}`,
        existingTranslationWithRemovedKeys
      );

      const editedSourceTranslation = changedFileStandAlone?.changes?.reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr?.key]: curr?.newValue,
          };
        },
        {}
      );

      console.log("EDITED", editedSourceTranslation);
      console.log("LOCATION", fileLocation);

      const edited = await translateText({
        sourceTranslation: editedSourceTranslation,
        config,
        targetLanguage,
      });

      existingTranslation = {
        ...existingTranslation,
        ...edited,
      };

      console.log(
        `🎉 - Successfully edited the keys  ${JSON.stringify(newKeys)} for: ${targetLanguage}. Saving it in the path: ${fileLocation}.`
      );

      console.log(`Edited new keys`);
    }

    if (Object.keys(existingTranslationWithRemovedKeys)?.length) {
      console.log(
        `🧹 - Removing the following keys for: ${targetLanguage} from: ${fileLocation}`,
        existingTranslationWithRemovedKeys
      );

      const newExistingKey = Object.fromEntries(
        Object.entries(existingTranslation).filter((translationKeyAndValue) => {
          const [translationKey] = translationKeyAndValue;
          return sourceTranslation?.[translationKey];
        })
      );

      console.log(
        `🎉 - Successfully removed the keys ${Object.keys(existingTranslationWithRemovedKeys)} for: ${targetLanguage}. Saving it in the path: ${fileLocation}.`
      );

      await writeJsonFile(fileLocation, newExistingKey);

      console.log("TODO SAVE THIS", newExistingKey);
    } else {
      await writeJsonFile(fileLocation, existingTranslation);
    }

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

  const newExistingTranslation = Object.fromEntries(
    Object.entries(newTranslation).filter((translationKeyAndValue) => {
      const [translationKey] = translationKeyAndValue;
      return sourceTranslation?.[translationKey];
    })
  );

  console.log(
    `🎉 - Successfully translated for: ${targetLanguage}. Saving it in the path: ${fileLocation}`,
    newExistingTranslation
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
