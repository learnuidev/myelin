const { log } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const {
  addStorageProvider,
} = require("../add-storage-provider/add-storage-provider");
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

const syncUp = async ({ fileLocation, projectId, metadata }) => {
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

  const translations = JSON.parse(item?.translations);

  if (translations) {
    await writeJsonFile(fileLocation, translations);
  }
};

const sync = async (step) => {
  const config = await loadConfig();

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
      throw new Error(
        "Project Id doesnt exist, please run `add-project` to create one"
      );
    } else {
      log.info(
        `Syncing into ${translationsTableName} using for the project: ${config.projectId}`
      );
    }

    const localeLocation = config.locale.location;

    const allLanguages = [
      config.locale.sourceLanguage,
      ...config.locale.targetLanguages,
    ];

    if (step === "up") {
      const sourceFolderPath = getSourceFolderPath({ config });

      const _isFolder = await isFolder(sourceFolderPath);

      const sourceTranslations =
        await loadJsonFilesFromFolder(sourceFolderPath);

      const sourceTranslation = await loadSourceTranslation({ config });

      if (_isFolder) {
        log.info(`Handle folder level sync`);

        for (let targetLanguage of allLanguages) {
          for (let sourceTranslationAndFileName of sourceTranslations || []) {
            const { fileName } = sourceTranslationAndFileName;
            const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

            await syncUp({
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

        await syncUp({
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

    if (step === "down") {
      const sourceFolderPath = getSourceFolderPath({ config });

      const _isFolder = await isFolder(sourceFolderPath, {
        remote: true,
      });
      const sourceTranslations = await loadJsonFilesFromFolder(
        sourceFolderPath,
        {
          remote: true,
        }
      );

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

      const sourceTranslation = await loadSourceTranslation(
        { config },
        { remote: true }
      );

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
