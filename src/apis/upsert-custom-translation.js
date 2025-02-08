const {
  customTranslationsTableName,
} = require("../../storage/dynamodb/custom-translations-table");
const {
  getItem,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/get-item");
const {
  upsertItem,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/upsert-item");

const upsertCustomTranslation = async ({ id, projectId, translations }) => {
  const item = await getItem({
    tableName: customTranslationsTableName,
    partitionKey: {
      id,
    },
    sortKey: {
      projectId,
    },
  });

  await upsertItem({
    tableName: customTranslationsTableName,
    partitionKey: {
      id,
    },
    sortKey: {
      projectId,
    },

    data: {
      translations: JSON.stringify(
        item?.translations
          ? { ...JSON.parse(item?.translations), ...translations }
          : { ...translations }
      ),

      updatedAt: Date.now(),
    },
  });
};

module.exports = {
  upsertCustomTranslation,
};
