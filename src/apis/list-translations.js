const {
  translationsTableName,
} = require("../../storage/dynamodb/translations-table");
const {
  queryItemsByProjectId,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");
const { loadConfig } = require("../actions/translate/utils/load-config");

const listTranslations = async () => {
  const config = await loadConfig();

  const items = await queryItemsByProjectId({
    projectId: config.projectId,
    tableName: translationsTableName,
  });

  return items;
};

module.exports = {
  listTranslations,
};
