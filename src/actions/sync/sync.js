const { log } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const {
  addStorageProvider,
} = require("../add-storage-provider/add-storage-provider");

const sync = async () => {
  const config = await loadConfig();

  let storageProvider = config.addStorageProvider;

  // check if storage provider exists
  if (!config?.storageProvider) {
    storageProvider = await addStorageProvider();
  }

  log.step("TODO: Create dynamodb table");
};

//
module.exports = {
  sync,
};
