const { loadConfig } = require("../translate/utils/load-config");
const {
  addStorageProvider,
} = require("../add-storage-provider/add-storage-provider");

const checkForDynamoDBStorageProvider = async () => {
  const config = await loadConfig();

  let storageProvider = config.storageProvider;

  // check if storage provider exists
  if (!storageProvider) {
    storageProvider = await addStorageProvider();
  }

  if (storageProvider === "dynamodb") {
    return storageProvider;
  }

  throw new Error(`DynamoDB storage provider not found`);
};

//
module.exports = {
  checkForDynamoDBStorageProvider,
};
