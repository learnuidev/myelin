const { printTable } = require("console-table-printer");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadSourceTranslations,
} = require("../translate/utils/load-source-translations");
const {
  getUncommittedChanges,
} = require("../translate/utils/git/get-uncommited-changes");

const printStats = async () => {
  const config = await loadConfig();

  const sourceTranslations = await loadSourceTranslations({ config });

  const structuredDiffs = await getUncommittedChanges(config?.locale?.location);

  const formattedTranslations = sourceTranslations.map((item) => {
    const changed = structuredDiffs?.find(
      (val) => val?.nameSpace === item?.baseFileName
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

    return {
      name_space: item?.baseFileName,
      total_keys: Object.keys(item?.sourceTranslation)?.length,
      new_keys: newKeys,
      edited_keys: editedKeys,
      removed_keys: deletedKeys,
    };
  });

  printTable(formattedTranslations);
};

module.exports = {
  printStats,
};
