const { loadJsonFilesFromFolder } = require("./load-json-files-from-folder");
const { isFolder } = require("./is-folder");
const { writeJsonFile } = require("./write-json-file");
const { spinner, log } = require("@clack/prompts");

const { loadSourceTranslation } = require("./load-source-translation");

const { loadTranslation } = require("./load-translation");

const { getSourceFolderPath } = require("./get-source-folder-path");

const smartCleanAndSave = async ({
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

  // 3.5. Handle deletion of keys
  const existingTranslationWithRemovedKeys = Object.fromEntries(
    Object.entries(existingTranslation).filter((translationKeyAndValue) => {
      const [translationKey] = translationKeyAndValue;
      return !sourceTranslation?.[translationKey];
    })
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
    log.success(`Nothing to clean for [${targetLanguage}/${fileName}]`);
  }

  return true;
};

const cleanAndSave = async ({ config, namespaces }) => {
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
        await smartCleanAndSave({
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

    await smartCleanAndSave({
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
  cleanAndSave,
};
