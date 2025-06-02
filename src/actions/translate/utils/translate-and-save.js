const { loadJsonFilesFromFolder } = require("./load-json-files-from-folder");
const { isFolder } = require("./is-folder");
const { writeJsonFile } = require("./write-json-file");
const { spinner, log } = require("@clack/prompts");

const { loadSourceTranslation } = require("./load-source-translation");

const { translateText } = require("./translate-text");
const { loadTranslation } = require("./load-translation");

const { getSourceFolderPath } = require("./get-source-folder-path");
const { getUncommittedChanges } = require("./git/get-uncommited-changes");

const smartTranslateAndSave = async ({
  fileLocation,
  sourceTranslation,
  config,
  targetLanguage,
  fileName,
  namespaced,
}) => {
  const s = spinner();

  // 1. First check if existing translations exist
  let originalExistingTranslation = await loadTranslation(fileLocation);
  let existingTranslation = { ...originalExistingTranslation };

  // 2. If not found then proceed with normal translation
  if (!existingTranslation) {
    s.start("Starting translation...");
    const translation = await translateText({
      fileLocation,
      sourceTranslation,
      config,
      targetLanguage,
    });

    await writeJsonFile(fileLocation, translation);

    s.stop(
      `Succcessfully translated the following: ${JSON.stringify(targetLanguage)}`
    );
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
    const structuredDiff = await getUncommittedChanges(
      config?.locale?.location
    );

    const key = namespaced
      ? `${config?.locale?.location}/${config?.locale?.sourceLanguage}/${fileName}`
      : `${config?.locale?.location}/${config?.locale?.sourceLanguage}.json`;

    const changedFile = structuredDiff?.find((file) =>
      file?.path?.includes(key)
    );

    if (Object.keys(existingTranslationWithRemovedKeys)?.length) {
      log.info(
        `🧹 - Removing ${Object.keys(existingTranslationWithRemovedKeys)?.length} keys for: ${targetLanguage} from: ${fileLocation}`,
        existingTranslationWithRemovedKeys
      );

      const newExistingKey = Object.fromEntries(
        Object.entries(existingTranslation).filter((translationKeyAndValue) => {
          const [translationKey] = translationKeyAndValue;
          return sourceTranslation?.[translationKey];
        })
      );

      log.success(
        `🎉 - Successfully removed the keys ${Object.keys(existingTranslationWithRemovedKeys)} for: ${targetLanguage}. Saving it in the path: ${fileLocation}.`
      );

      await writeJsonFile(fileLocation, newExistingKey);
    } else {
      if (
        JSON.stringify(existingTranslation) !==
        JSON.stringify(originalExistingTranslation)
      ) {
        await writeJsonFile(fileLocation, existingTranslation);
      }
      // return null;
    }

    if (!changedFile) {
      // log.info(`Nothing to translate for ${key}`);
      return true;
    }

    if (changedFile) {
      const { lastContent, currentContent } = changedFile;

      const newContent = Object.entries(currentContent).reduce((acc, curr) => {
        const [key, val] = curr;

        if (val === lastContent?.[key]) {
          return acc;
        } else {
          return {
            ...acc,
            [key]: val,
          };
        }
      }, []);

      if (Object.keys(newContent)?.length) {
        s.start(
          `😃 - Translating the following for: ${targetLanguage} [${fileLocation}]: `
        );

        const edited = await translateText({
          fileLocation,
          sourceTranslation: newContent,
          config,
          targetLanguage,
        });

        const newKeys = Object.keys(edited);

        existingTranslation = {
          ...existingTranslation,
          ...edited,
        };

        s.stop(
          `🎉 - Successfully translated edited the ${newKeys?.length} keys for: ${targetLanguage}. Saving it path: ${fileLocation}.`
        );
      }
    }

    return null;
  }

  const totalKeys = Object.keys(newSourceTranslation)?.length;

  log.info(
    `${totalKeys} new ${totalKeys > 1 ? "keys" : "key"} found in ${fileName} [${targetLanguage}]`
  );

  s.start(
    `😃 - Translating the following for: ${targetLanguage} [${fileName}]: `
  );

  // 5: Otherwise translate new translations and save new translations with
  const translation = await translateText({
    fileLocation,
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

  s.stop(
    `🎉 - Successfully translated for: ${targetLanguage} [${fileName}]`,
    newExistingTranslation
  );

  await writeJsonFile(fileLocation, newTranslation);
  return true;
};

const translateAndSave = async ({ config, namespaces }) => {
  // Flow for folder level
  const localeLocation = config.locale.location;

  const sourceFolderPath = getSourceFolderPath({ config });

  const _isFolder = await isFolder(sourceFolderPath);

  // Flow for folder level translation
  if (_isFolder) {
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);

    if (namespaces?.length) {
      const isValidNameSpace = namespaces?.every((nameSpace) =>
        sourceTranslations?.find(
          (translation) => translation.baseFileName === nameSpace
        )
      );
      if (!isValidNameSpace) {
        const invalidNameSpaceFiles = namespaces?.filter(
          (nameSpace) =>
            sourceTranslations?.filter(
              (translation) => translation.baseFileName === nameSpace
            )?.length === 0
        );

        const validNamespaces = sourceTranslations?.map(
          (translation) => translation.baseFileName
        );
        throw new Error(
          `${JSON.stringify(invalidNameSpaceFiles)} is not a valid namespace. Please enter one of the following: ${JSON.stringify(validNamespaces)} `
        );
      }
    }

    const filteredSourceTranslations =
      namespaces?.length > 0
        ? sourceTranslations?.filter((translation) =>
            namespaces?.includes(translation.baseFileName)
          )
        : sourceTranslations;

    for (let targetLanguage of config.locale.targetLanguages) {
      for (let sourceTranslationAndFileName of filteredSourceTranslations ||
        []) {
        const { fileName, sourceTranslation } = sourceTranslationAndFileName;
        const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

        // await writeJsonFile(fileLocation, newTranslation);
        await smartTranslateAndSave({
          fileLocation,
          sourceTranslation,
          config,
          targetLanguage,
          fileName,
          namespaced: true,
        });
      }
    }
  }

  // Flow for file level translation
  const sourceTranslation = await loadSourceTranslation({ config });

  if (!sourceTranslation) {
    return null;
  }

  for (let targetLanguage of config.locale.targetLanguages) {
    const fileLocation = `./${localeLocation}/${targetLanguage}.json`;

    await smartTranslateAndSave({
      fileLocation,
      sourceTranslation,
      config,
      targetLanguage,
      fileName: targetLanguage,
      namespaced: false,
    });
  }
};

module.exports = {
  translateAndSave,
};
