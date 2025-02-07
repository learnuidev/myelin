const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");
const { log } = require("@clack/prompts");

async function getItem({ tableName, partitionKey, sortKey }) {
  const params = {
    TableName: tableName,
    Key: {
      ...partitionKey,
      ...sortKey,
    },
    // ProjectionExpression: "attribute1, attribute2", // Optional: specify attributes to retrieve
  };

  const client = await getDynamodbClient();

  const docClient = DynamoDBDocumentClient.from(client);

  try {
    const data = await docClient.send(new GetCommand(params));
    log.success("Item retrieved successfully:");
    return data.Item;
  } catch (err) {
    console.error("Error retrieving item:", err);
  }
}

module.exports = {
  getItem,
};
