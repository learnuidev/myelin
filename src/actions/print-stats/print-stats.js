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

const printStats = async () => {
  const config = await loadConfig();

  const sourceTranslations = await loadSourceTranslations({ config });

  const structuredDiffs = await getUncommittedChanges(config?.locale?.location);

  const entry = config.locale.sourceEntry;

  const files = await extractFiles({
    directoryPath: `./${entry}`,
  });

  const formattedTranslations = sourceTranslations.map((item) => {
    const nameSpace = item?.baseFileName;
    const changed = structuredDiffs?.find(
      (val) => val?.nameSpace === nameSpace
    );

    const lastContent = changed?.lastContent;
    const currentContent = changed?.currentContent;

    const newKeys = Object.keys(currentContent || [])?.filter(
      (item) => !lastContent?.[item]
    )?.length;

    const deletedKeys = Object.keys(lastContent || [])?.filter(
      (item) => !currentContent?.[item]
    )?.length;

    const editedKeys = Object.keys(currentContent || [])?.filter(
      (item) =>
        lastContent?.[item] &&
        JSON.stringify(currentContent?.[item]) !==
          JSON.stringify(lastContent?.[item])
    )?.length;

    const unusedKeys = Object.keys(item?.sourceTranslation || {})?.filter(
      (key) => {
        const notUsedInFile = files?.filter((file) =>
          file?.code?.includes(`${nameSpace}:${key}`)
        );
        return notUsedInFile?.length === 0;
      }
    );

    return {
      name_space: item?.baseFileName,
      total_keys: Object.keys(item?.sourceTranslation)?.length,
      new_keys: newKeys,
      edited_keys: editedKeys,
      removed_keys: deletedKeys,
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
          edited_keys > 0 ? picocolors.yellowBright(edited_keys) : edited_keys,
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
