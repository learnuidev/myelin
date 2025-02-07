const { log, select } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const { updateConfig } = require("../translate/utils/update-config");

const addStorageProvider = async () => {
  const config = await loadConfig();
  log.step("Adding storage provider...");

  if (config.storageProvider) {
    log.warn("Storage provider already exists");
    return;
  }

  const storageProvider = await select({
    message: "Enter your storage provider",
    placeholder: "dynamodb",
    options: [
      { value: "dynamodb", label: "DynamoDB" },
      { value: "postgres", label: "PostgreSQL (Coming Soon)" },
      { value: "convex", label: "ConvexDB (Coming Soon)" },
    ],
  });

  if (storageProvider !== "dynamodb") {
    throw new Error("Only dynamodb is supported at the moment");
  }

  await updateConfig({
    storageProvider,
  });

  log.success("Storage provider successfully added...");

  return storageProvider;
};

module.exports = {
  addStorageProvider,
};
