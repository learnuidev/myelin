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
const {
  loadSourceTranslation,
} = require("../translate/utils/load-source-translation");

const syncUp = async ({ fileLocation, projectId }) => {
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
      translations,
      updatedAt: Date.now(),
    },
  });
};

const syncDown = async ({ fileLocation, projectId }) => {
  log.info(`Downloading ${fileLocation}`);

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
};

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
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath, {
      remote: true,
    });

    console.log("SOURCE TRANSLATIONS", sourceTranslations);

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

            await syncUp({
              fileLocation,
              projectId,
            });
          }
        }

        log.success(`Syncing complete for: ${projectId}`);
      }

      // file level translation
      let sourceTranslation;

      try {
        sourceTranslation = await loadSourceTranslation({ config });
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        sourceTranslation = null;
      }

      if (!sourceTranslation) {
        return null;
      }

      for (let language of allLanguages) {
        const fileLocation = `./${localeLocation}/${language}.json`;

        await syncUp({
          fileLocation,
          projectId,
        });
      }

      log.success(`Syncing file level complete for: ${projectId}`);
    }

    if (step === "down") {
      if (_isFolder) {
        for (let targetLanguage of allLanguages) {
          for (let sourceTranslationAndFileName of sourceTranslations || []) {
            const { fileName } = sourceTranslationAndFileName;
            const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

            await syncDown({
              projectId,
              fileLocation,
            });
          }
        }

        log.success(`Successfully downloaded translations for: ${projectId}`);
      }

      try {
        sourceTranslation = await loadSourceTranslation({ config });
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        sourceTranslation = null;
      }

      if (!sourceTranslation) {
        return null;
      }

      for (let language of allLanguages) {
        const fileLocation = `./${localeLocation}/${language}.json`;

        await syncDown({
          projectId,
          fileLocation,
        });
      }

      log.success(`Downloading file level complete for: ${projectId}`);
    }
  }
};

//
module.exports = {
  sync,
};
