const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");

async function addItem({ tableName, item }) {
  const client = await getDynamodbClient();

  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    const command = new PutCommand(params);
    const response = await docClient.send(command);

    // console.log("Item added successfully:", response);
    return response;
  } catch (err) {
    console.error("Error adding item:", err);
  }
}

module.exports = {
  addItem,
};
