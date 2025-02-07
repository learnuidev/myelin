const { DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { getDynamodbClient } = require("./get-dynamodb-client");

const checkIfDynamoDBTableExists = async (tableName) => {
  const client = await getDynamodbClient();

  try {
    await client.send(
      new DescribeTableCommand({
        TableName: tableName,
      })
    );

    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};

module.exports = {
  checkIfDynamoDBTableExists,
};
