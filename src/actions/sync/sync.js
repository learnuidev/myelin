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

const { syncDown } = require("./sync-down");
const { syncUp } = require("./sync-up");
const { addProject } = require("../add-project/add-project");
const {
  customTranslationsTableName,
} = require("../../../storage/dynamodb/custom-translations-table");

const sync = async (step) => {
  let config = await loadConfig();

  let projectId = config.projectId;

  if (!projectId) {
    projectId = await addProject();
  }

  config = await loadConfig();

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
    await createTableIfDoesntExist({
      tableName: customTranslationsTableName,
      tableOptions: translationsTableOptions,
    });

    if (step === "up") {
      await syncUp(projectId);
    }

    if (step === "down") {
      await syncDown(projectId);
    }
  }
};

//
module.exports = {
  sync,
};
