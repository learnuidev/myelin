const {
  translationsTableName,
} = require("../../storage/dynamodb/translations-table");
const {
  queryItemsByProjectId,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");
const { loadConfig } = require("../actions/translate/utils/load-config");

const loadTranslations = async ({ lang, ns }) => {
  const config = await loadConfig();

  const items = await queryItemsByProjectId({
    projectId: config.projectId,
    tableName: translationsTableName,
  });

  const item = items?.find((item) => {
    return item?.id?.includes(`${lang}/${ns}.json`);
  });

  const translations = item?.translations;

  return translations;
};

module.exports = {
  loadTranslations,
};
