const { spinner, log } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadSourceTranslations,
} = require("../translate/utils/load-source-translations");
const { extractFiles } = require("../eat/pipeline/extract-files");
const { loadTranslation } = require("../translate/utils/load-translation");
const { writeJsonFile } = require("../translate/utils/write-json-file");

const clean = async (params) => {
  const s = spinner();

  const config = await loadConfig();

  const sourceTranslations = await loadSourceTranslations({ config });

  const entries = config?.locale?.sourceEntries;

  const files = (
    await Promise.all(
      entries.map(async (entry) => {
        return await extractFiles({
          directoryPath: `./${entry}`,
        });
      })
    )
  )?.flat();

  s.start("Finding unused keys...");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const sourceTranslationsWithUnusedKeys = sourceTranslations.map((item) => {
    const sourceTranslationValues = Object.values(item.sourceTranslation);

    const unusedKeys = Object.keys(item?.sourceTranslation || {})?.filter(
      (key) => {
        const notUsedInFile = files?.filter((file) => {
          const keyWithUnderScore = key?.split("_");
          const parentKey = keyWithUnderScore?.[0];

          if (keyWithUnderScore?.length > 1) {
            return (
              file?.code?.includes(`${parentKey}`) ||
              JSON.stringify(sourceTranslationValues)?.includes(parentKey)
            );
          }
          return (
            file?.code?.includes(`${key}`) ||
            JSON.stringify(sourceTranslationValues)?.includes(parentKey)
          );
        });
        return notUsedInFile?.length === 0;
      }
    );

    return {
      ...item,
      nameSpace: item?.baseFileName,
      unusedKeys: unusedKeys,
    };
  });

  const totalUnusedKeys = sourceTranslationsWithUnusedKeys
    ?.map((item) => item?.unusedKeys)
    ?.flat();

  if (totalUnusedKeys?.length === 0) {
    s.stop("It seems all keys are used! ✨");
    // return;
  }

  s.message(
    `Found ${totalUnusedKeys?.length} unused keys in ${sourceTranslationsWithUnusedKeys?.length} namespaces, removing them now 🧹`
  );

  const filteredSourceTranslations = sourceTranslationsWithUnusedKeys;

  // Flow for folder level
  const localeLocation = config.locale.location;

  for (let targetLanguage of [
    ...config.locale.targetLanguages,
    config.locale.sourceLanguage,
  ]) {
    for (let sourceTranslationAndFileName of filteredSourceTranslations || []) {
      const { fileName, sourceTranslation, unusedKeys } =
        sourceTranslationAndFileName;
      const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

      let originalExistingTranslation = await loadTranslation(fileLocation);

      const existingTranslationWithRemovedKeys = Object.fromEntries(
        Object.entries(originalExistingTranslation).filter(
          (translationKeyAndValue) => {
            const [translationKey] = translationKeyAndValue;
            return !unusedKeys?.includes(translationKey);
          }
        )
      );

      await writeJsonFile(fileLocation, existingTranslationWithRemovedKeys);

      //   console.log(
      //     "original existing translation",
      //     existingTranslationWithRemovedKeys
      //   );
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));

  s.stop(
    `Removed ${totalUnusedKeys?.length} unused keys from ${sourceTranslationsWithUnusedKeys?.length} namespaces... ✨`
  );
};

module.exports = {
  clean,
};
