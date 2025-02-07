const {
  CreateTableCommand,
  waitUntilTableExists,
} = require("@aws-sdk/client-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");

async function createAndWaitForTable(tableName, options) {
  const client = await getDynamodbClient();

  const createParams = {
    TableName: tableName,
    ...options,
  };

  try {
    // Create the table
    await client.send(new CreateTableCommand(createParams));
    console.log(`Table ${tableName} creation initiated...`);

    // Wait for table to become active
    const waitResult = await waitUntilTableExists(
      { client, maxWaitTime: 300 },
      { TableName: tableName }
    );

    if (waitResult.state === "SUCCESS") {
      console.log(`Table ${tableName} is now active`);
      return true;
    }
    throw new Error("Table creation timeout");
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(`Table ${tableName} already exists`);
      return true;
    }
    console.error("Creation error:", error);
    throw error;
  }
}

module.exports = {
  createAndWaitForTable,
};
