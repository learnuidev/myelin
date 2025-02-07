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

const {
  getItem,
} = require("../add-cloud-provider/aws/utils/dynamodb/get-item");
const { writeJsonFile } = require("../translate/utils/write-json-file");
const {
  loadSourceTranslation,
} = require("../translate/utils/load-source-translation");
const {
  checkForDynamoDBStorageProvider,
} = require("./check-for-dynamodb-storage-provider");

const _syncDown = async ({ fileLocation, projectId }) => {
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

const syncDown = async (projectId) => {
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
        `Syncing into ${translationsTableName} using for the project: ${config.projectId}`
      );
    }

    const localeLocation = config.locale.location;

    const allLanguages = [
      config.locale.sourceLanguage,
      ...config.locale.targetLanguages,
    ];

    const sourceFolderPath = getSourceFolderPath({ config });

    const _isFolder = await isFolder(sourceFolderPath, {
      remote: true,
    });
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath, {
      remote: true,
    });

    if (!sourceTranslations?.length) {
      throw new Error(
        `Translations not found. Please run 'npx myelino sync up' to upload your translations`
      );
    }

    if (_isFolder) {
      for (let targetLanguage of allLanguages) {
        for (let sourceTranslationAndFileName of sourceTranslations || []) {
          const { fileName } = sourceTranslationAndFileName;
          const fileLocation = `./${localeLocation}/${targetLanguage}/${fileName}`;

          await _syncDown({
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

      await _syncDown({
        projectId,
        fileLocation,
      });
    }

    log.success(`Downloading file level complete for: ${projectId}`);
  }
};

//
module.exports = {
  syncDown,
};
