const { log } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");

const {
  translationsTableName,
} = require("../../../storage/dynamodb/translations-table");

const {
  getSourceFolderPath,
} = require("../translate/utils/get-source-folder-path");
const { isFolder } = require("../translate/utils/is-folder");
const {
  loadJsonFilesFromFolder,
} = require("../translate/utils/load-json-files-from-folder");
const { loadTranslation } = require("../translate/utils/load-translation");
const {
  upsertItem,
} = require("../add-cloud-provider/aws/utils/dynamodb/upsert-item");

const {
  loadSourceTranslation,
} = require("../translate/utils/load-source-translation");
const {
  checkForDynamoDBStorageProvider,
} = require("./check-for-dynamodb-storage-provider");

const _syncUp = async ({ fileLocation, projectId, metadata }) => {
  let translations = await loadTranslation(fileLocation);

  log.info(`Syncing ${fileLocation}`);

  await upsertItem({
    tableName: translationsTableName,
    partitionKey: {
      id: fileLocation,
    },
    sortKey: {
      projectId,
    },
    data: {
      translations: JSON.stringify(translations),
      ...metadata,
      updatedAt: Date.now(),
    },
  });
};

const syncUp = async (projectId) => {
  const config = await loadConfig();

  const storageProvider = await checkForDynamoDBStorageProvider();

  if (storageProvider === "dynamodb") {
    // let projectId = config?.projectId;

    if (!projectId) {
      throw new Error(
        "Project Id doesnt exist, please run `add-project` to create one"
      );
    } else {
      log.info(
        `Syncing into ${translationsTableName} using for the project: ${projectId}`
      );
    }

    const localeLocation = config.locale.location;

    const allLanguages = [
      config.locale.sourceLanguage,
      ...config.locale.targetLanguages,
    ];

    const sourceFolderPath = getSourceFolderPath({ config });

    const _isFolder = await isFolder(sourceFolderPath);

    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);

    const sourceTranslation = await loadSourceTranslation({ config });

    if (_isFolder) {
      log.info(`Handle folder level sync`);

      for (let targetLanguage of allLanguages) {
        for (let sourceTranslationAndFileName of sourceTranslations || []) {
          const { fileName } = sourceTranslationAndFileName;
          const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

          await _syncUp({
            fileLocation,
            projectId,
            metadata: {
              fileName,
              fileLocation,
              lang: targetLanguage,
              type: "folder",
            },
          });
        }
      }

      log.success(`Syncing namespaces complete for: ${projectId}`);
    }

    if (!sourceTranslation) {
      return null;
    }

    for (let language of allLanguages) {
      const fileLocation = `./${localeLocation}/${language}.json`;

      await _syncUp({
        fileLocation,
        projectId,
        metadata: {
          fileLocation,
          lang: language,
          type: "file",
        },
      });
    }

    log.success(`Syncing files complete for: ${projectId}`);
  }
};

//
module.exports = {
  syncUp,
};
