const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");

async function scan(tableName) {
  const client = await getDynamodbClient();

  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: tableName,
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    return data.Items;
  } catch (err) {
    console.error("Error scanning items:", err);
    throw err;
  }
}

module.exports = {
  scan,
};
