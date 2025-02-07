const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");
const { log } = require("@clack/prompts");

const getKeyFromObj = (obj) => Object.keys(obj)?.[0];
const createAttriuteNotExists = (obj) =>
  `attribute_not_exists(${getKeyFromObj(obj)})`;

async function upsertItem({ tableName, partitionKey, sortKey, data }) {
  const client = await getDynamodbClient();

  const docClient = DynamoDBDocumentClient.from(client);

  let ConditionExpression = createAttriuteNotExists(partitionKey);

  if (sortKey) {
    ConditionExpression = `${ConditionExpression} AND ${createAttriuteNotExists(sortKey)}`;
  }

  const params = {
    TableName: tableName,
    Item: {
      ...partitionKey,
      ...sortKey,
      ...data,
    },
    ConditionExpression: ConditionExpression,
  };

  try {
    await docClient.send(new PutCommand(params));

    // console.log("Item inserted successfully");
    return true;
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      // Item exists, perform an update
      await update({ tableName, partitionKey, sortKey, data });
    } else {
      throw err;
    }
  }
}

async function update({ tableName, partitionKey, sortKey, data: dataItems }) {
  const client = await getDynamodbClient();

  const docClient = DynamoDBDocumentClient.from(client);

  const data = { ...dataItems };
  const updateExpression =
    "set " +
    Object.keys(data)
      .map((key) => `#${key} = :${key}`)
      .join(", ");
  const expressionAttributeNames = Object.keys(data).reduce(
    (acc, key) => ({ ...acc, [`#${key}`]: key }),
    {}
  );
  const expressionAttributeValues = Object.entries(data).reduce(
    (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
    {}
  );

  const params = {
    TableName: tableName,
    Key: {
      ...partitionKey,
      ...sortKey,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await docClient.send(new UpdateCommand(params));
    log.success("Translation synced successfully");
  } catch (err) {
    console.error("Error updating item:", err);
    throw err;
  }
}

module.exports = {
  upsertItem,
};
