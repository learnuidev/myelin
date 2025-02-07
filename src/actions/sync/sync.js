const { log, spinner } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const {
  addStorageProvider,
} = require("../add-storage-provider/add-storage-provider");
const {} = require("../add-cloud-provider/aws/utils/dynamodb/check-if-dynamo-table-exists");
const {} = require("../add-cloud-provider/aws/utils/dynamodb/create-and-wait-for-table");
const {
  translationsTableOptions,
  translationsTableName,
} = require("../../../storage/dynamodb/translations-table");
const {
  projectsTableName,
  projectsTableOptions,
} = require("../../../storage/dynamodb/project-table");
const {
  createTableIfDoesntExist,
} = require("../add-cloud-provider/aws/utils/dynamodb/create-table-if-doesnt-exist");
const { addProject } = require("../add-project/add-project");
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
  getItem,
} = require("../add-cloud-provider/aws/utils/dynamodb/get-item");
const { writeJsonFile } = require("../translate/utils/write-json-file");

const sync = async (step) => {
  const config = await loadConfig();

  const s = spinner();

  let storageProvider = config.storageProvider;

  // check if storage provider exists
  if (!storageProvider) {
    storageProvider = await addStorageProvider();
  } else {
    log.info(`Storage service: ${storageProvider}`);
  }

  if (storageProvider === "dynamodb") {
    await createTableIfDoesntExist({
      tableName: projectsTableName,
      tableOptions: projectsTableOptions,
    });
    await createTableIfDoesntExist({
      tableName: translationsTableName,
      tableOptions: translationsTableOptions,
    });

    let projectId = config?.projectId;

    if (!projectId) {
      log.info(`Project doesnt exist, creating a new one`);

      projectId = await addProject();

      log.info(
        `Syncing into ${translationsTableName} using for the project: ${projectId}`
      );
    } else {
      log.info(
        `Syncing into ${translationsTableName} using for the project: ${config.projectId}`
      );
    }

    const localeLocation = config.locale.location;

    const sourceFolderPath = getSourceFolderPath({ config });

    const _isFolder = await isFolder(sourceFolderPath);
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);

    const allLanguages = [
      config.locale.sourceLanguage,
      ...config.locale.targetLanguages,
    ];

    if (step === "up") {
      if (_isFolder) {
        log.info(`Handle folder level sync`);

        for (let targetLanguage of allLanguages) {
          for (let sourceTranslationAndFileName of sourceTranslations || []) {
            const { fileName, sourceTranslation } =
              sourceTranslationAndFileName;
            const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

            log.info(`Syncing ${fileLocation}`);

            let translations = await loadTranslation(fileLocation);

            await upsertItem({
              tableName: translationsTableName,
              partitionKey: {
                id: fileLocation,
              },
              sortKey: {
                projectId,
              },
              data: {
                translations,
                updatedAt: Date.now(),
              },
            });
          }
        }
      }
      log.success(`Syncing complete for: ${projectId}`);
    }

    if (step === "down") {
      for (let targetLanguage of allLanguages) {
        for (let sourceTranslationAndFileName of sourceTranslations || []) {
          const { fileName, sourceTranslation } = sourceTranslationAndFileName;
          const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

          log.info(`Syncing ${fileLocation}`);

          let item = await getItem({
            tableName: translationsTableName,
            partitionKey: {
              id: fileLocation,
            },
            sortKey: {
              projectId,
            },
          });

          const translations = item?.translations;

          if (translations) {
            await writeJsonFile(fileLocation, translations);
          }
        }
      }

      log.success(`Successfully downloaded translations for: ${projectId}`);
    }
  }
};

//
module.exports = {
  sync,
};
