const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");
const {
  translationsTableName,
} = require("../../../../../../storage/dynamodb/translations-table");

async function queryItemsByProjectId({ projectId }) {
  const client = await getDynamodbClient();

  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: translationsTableName,
    KeyConditionExpression: "projectId = :projectId",
    ExpressionAttributeValues: {
      ":projectId": projectId,
    },
    IndexName: "byProjectId",
  };

  try {
    const data = await docClient.send(new QueryCommand(params));
    return data.Items.map((item) => {
      return {
        ...item,
        translations: JSON.parse(item.translations),
      };
    });
  } catch (err) {
    console.error("Error querying items:", err);
    throw err;
  }
}

module.exports = {
  queryItemsByProjectId,
};
