const { log, spinner } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const {
  addStorageProvider,
} = require("../add-storage-provider/add-storage-provider");
const {
  checkIfDynamoDBTableExists,
} = require("../add-cloud-provider/aws/utils/dynamodb/check-if-dynamo-table-exists");
const {
  createAndWaitForTable,
} = require("../add-cloud-provider/aws/utils/dynamodb/create-and-wait-for-table");
const { AttributeValue } = require("@aws-sdk/client-dynamodb");

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

  const projectsTableName = "MyelinProjectsTable";

  log.info(`Checking if projects table exists`);
  const projectsTable = await checkIfDynamoDBTableExists(projectsTableName);

  if (!projectsTable) {
    s.stop(`Projects table doesnt exist`);
    s.start(`Creating new projects table [MyelinProjectsTable]. Please wait`);

    await createAndWaitForTable(projectsTableName, {
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    });

    s.stop("Projects table created successfully!");
  } else {
    log.success(`Projects table exist`);
  }

  log.info(`Checking if translations table exists`);

  const translationsTableName = "MyelinTranslationsTable";

  const translationsTable = await checkIfDynamoDBTableExists(
    translationsTableName
  );

  if (!translationsTable) {
    s.stop(`Translations table doesnt exist`);
    s.start(
      `Creating new translations table [MyelinTranslationsTable]. Please wait...`
    );

    await createAndWaitForTable(translationsTableName, {
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
        { AttributeName: "projectId", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "projectId", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
      GlobalSecondaryIndexes: [
        {
          IndexName: "byProjectId",
          KeySchema: [{ AttributeName: "projectId", KeyType: "HASH" }],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
    });

    s.stop("Translations table created successfully!");
  } else {
    log.success(`Translations table exist`);
  }

  log.info(`Sync info`);
};

//
module.exports = {
  sync,
};
