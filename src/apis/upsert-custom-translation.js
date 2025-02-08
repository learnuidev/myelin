const {
  customTranslationsTableName,
} = require("../../storage/dynamodb/custom-translations-table");
const {
  translationsTableName,
} = require("../../storage/dynamodb/translations-table");
const {
  getItem,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/get-item");
const {
  upsertItem,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/upsert-item");

const upsertCustomTranslation = async ({ id, projectId, translations }) => {
  const originalItem = await getItem({
    tableName: translationsTableName,
    partitionKey: {
      id,
    },
    sortKey: {
      projectId,
    },
  });
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
      ...originalItem,
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
