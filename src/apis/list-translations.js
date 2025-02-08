const {
  queryItemsByProjectId,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");
const { loadConfig } = require("../actions/translate/utils/load-config");

const listTranslations = async () => {
  const config = await loadConfig();

  const items = await queryItemsByProjectId({
    projectId: config.projectId,
  });

  return items?.map((item) => {
    return {
      ...item,
      translations: JSON.parse(item?.translations || "{}"),
    };
  });
};

module.exports = {
  listTranslations,
};
