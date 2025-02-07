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

const sync = async () => {
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

    log.info(`Create project`);
  }
};

//
module.exports = {
  sync,
};
