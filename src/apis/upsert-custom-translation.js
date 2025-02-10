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
const { loadConfig } = require("../actions/translate/utils/load-config");
const {
  loadTranslation,
} = require("../actions/translate/utils/load-translation");
const { writeJsonFile } = require("../actions/translate/utils/write-json-file");
const { isLocalSync } = require("../utils/is-local-sync");

const upsertCustomTranslation = async ({ id, projectId, translations }) => {
  const config = await loadConfig();

  if (isLocalSync({ config })) {
    const fileLocation = id;

    // return fileLocation;

    const oldTranslations = await loadTranslation(fileLocation);

    const updatedTranslation = {
      ...oldTranslations,
      ...translations,
    };

    await writeJsonFile(fileLocation, updatedTranslation);

    return updatedTranslation;
  }
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

  // writing to custom table
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

  console.log("ORIGINAL FILE", originalItem?.fileLocation);

  if (originalItem?.fileLocation) {
    await writeJsonFile(originalItem.fileLocation, updatedTranslation);
  }

  // sync up yo

  return updatedTranslation;
};

// upsertCustomTranslation({
//   id: "9b4101ef-9a85-4478-961b-92a4fa5c0b4c#./locales/es/common.json",
//   translations: {
//     okay: "Bale bale",
//   },
// }).then((location) => {
//   console.log("LOCATION", location);
// });

module.exports = {
  upsertCustomTranslation,
};
