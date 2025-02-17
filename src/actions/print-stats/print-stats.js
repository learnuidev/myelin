const { printTable } = require("console-table-printer");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadSourceTranslations,
} = require("../translate/utils/load-source-translations");
const {
  getUncommittedChanges,
} = require("../translate/utils/git/get-uncommited-changes");

const picocolors = require("picocolors");
const { extractFiles } = require("../eat/pipeline/extract-files");
const { note } = require("@clack/prompts");

const printStats = async (subCommands) => {
  const config = await loadConfig();

  const sourceTranslations = await loadSourceTranslations({ config });

  const sourceTranslationsAll = sourceTranslations.map((item) =>
    Object.values(item?.sourceTranslation)
  );

  const structuredDiffs = await getUncommittedChanges(config?.locale?.location);

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

  const formattedTranslations = sourceTranslations.map((item) => {
    const nameSpace = item?.baseFileName;
    const changed = structuredDiffs?.find(
      (val) => val?.nameSpace === nameSpace
    );

    const lastContent = changed?.lastContent;
    const currentContent = changed?.currentContent;

    const newKeys = Object.keys(currentContent || [])?.filter(
      (item) => !lastContent?.[item]
    );

    if (subCommands?.includes("added") && newKeys?.length > 0) {
      note(
        JSON.stringify(newKeys, null, 4),
        `${picocolors.bold(item?.baseFileName)}:${picocolors.greenBright(`added`)}`
      );
    }

    const deletedKeys = Object.keys(lastContent || [])?.filter(
      (item) => !currentContent?.[item]
    );

    if (subCommands?.includes("deleted") && deletedKeys?.length > 0) {
      note(
        JSON.stringify(deletedKeys, null, 4),
        `${picocolors.bold(item?.baseFileName)}:${picocolors.redBright(`removed`)}`
      );
    }

    const editedKeys = Object.keys(currentContent || [])?.filter(
      (item) =>
        lastContent?.[item] &&
        JSON.stringify(currentContent?.[item]) !==
          JSON.stringify(lastContent?.[item])
    );

    if (subCommands?.includes("edited") && editedKeys?.length > 0) {
      note(
        JSON.stringify(editedKeys, null, 4),
        `${picocolors.bold(item?.baseFileName)}:${picocolors.blueBright(`edited`)}`
      );
    }

    const unusedKeys = Object.keys(item?.sourceTranslation || {})?.filter(
      (key) => {
        const notUsedInFile = files?.filter((file) => {
          const keyWithUnderScore = key?.split("_");

          if (keyWithUnderScore?.length > 1) {
            return (
              file?.code?.includes(`${keyWithUnderScore?.[0]}`) ||
              JSON.stringify(sourceTranslationsAll)?.includes(
                keyWithUnderScore?.[0]
              )
            );
          }
          return file?.code?.includes(`${key}`);
        });
        return notUsedInFile?.length === 0;
      }
    );

    if (subCommands?.includes("unused") && unusedKeys?.length > 0) {
      note(
        JSON.stringify(unusedKeys, null, 4),
        `${picocolors.bold(item?.baseFileName)}:${picocolors.yellowBright(`unused`)}`
      );
    }

    return {
      name_space: item?.baseFileName,
      total_keys: Object.keys(item?.sourceTranslation)?.length,
      new_keys: newKeys?.length || 0,
      edited_keys: editedKeys?.length || 0,
      removed_keys: deletedKeys?.length || 0,
      unused_keys: unusedKeys?.length || 0,
    };
  });

  const formattedTranslationsWithTotal = [
    ...formattedTranslations,
    {
      ...formattedTranslations?.reduce(
        (acc, curr) => {
          return {
            ...acc,
            total_keys: acc?.total_keys + curr?.total_keys,
            new_keys: acc?.new_keys + curr?.new_keys,
            edited_keys: acc?.edited_keys + curr?.edited_keys,
            removed_keys: acc?.removed_keys + curr?.removed_keys,
            unused_keys: acc?.unused_keys + curr?.unused_keys,
          };
        },
        {
          total_keys: 0,
          new_keys: 0,
          edited_keys: 0,
          removed_keys: 0,
          unused_keys: 0,
        }
      ),
      name_space: picocolors.bold("total"),
    },
  ];

  printTable(
    formattedTranslationsWithTotal.map((item) => {
      const {
        name_space,
        total_keys,
        new_keys,
        edited_keys,
        removed_keys,
        unused_keys,
      } = item;
      return {
        name_space,
        total_keys,
        new_keys: new_keys > 0 ? picocolors.greenBright(new_keys) : new_keys,
        edited_keys:
          edited_keys > 0 ? picocolors.blueBright(edited_keys) : edited_keys,
        removed_keys:
          removed_keys > 0 ? picocolors.redBright(removed_keys) : removed_keys,
        unused_keys:
          unused_keys > 0 ? picocolors?.yellowBright(unused_keys) : unused_keys,
      };
    })
  );
};

module.exports = {
  printStats,
};
