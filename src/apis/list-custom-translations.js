const {
  customTranslationsTableName,
} = require("../../storage/dynamodb/custom-translations-table");
const {
  queryItemsByProjectId,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");
const { loadConfig } = require("../actions/translate/utils/load-config");

const listCustomTranslations = async () => {
  const config = await loadConfig();

  const items = await queryItemsByProjectId({
    projectId: config.projectId,
    tableName: customTranslationsTableName,
  });

  return items;
};

module.exports = {
  listCustomTranslations,
};
