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
const { writeJsonFile } = require("../actions/translate/utils/write-json-file");

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

  const {
    id: originalId,
    projectId: originalProjectId,
    ...rest
  } = originalItem;

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
      // ...originalItem,
      ...rest,
      translations: JSON.stringify(
        item?.translations
          ? { ...JSON.parse(item?.translations), ...translations }
          : { ...translations }
      ),

      updatedAt: Date.now(),
    },
  });

  const updatedTranslation = {
    ...JSON.parse(originalItem?.translations),
    ...JSON.parse(item?.translations),
    ...translations,
  };

  // writing to translations table
  await upsertItem({
    tableName: translationsTableName,
    partitionKey: {
      id,
    },
    sortKey: {
      projectId,
    },

    data: {
      // ...originalItem,
      ...rest,
      translations: JSON.stringify(updatedTranslation),

      updatedAt: Date.now(),
    },
  });

  if (originalItem?.fileLocation) {
    await writeJsonFile(originalItem.fileLocation, updatedTranslation);
  }

  // sync up yo

  return { status: "success" };
};

module.exports = {
  upsertCustomTranslation,
};
