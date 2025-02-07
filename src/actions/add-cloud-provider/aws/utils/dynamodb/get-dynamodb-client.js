const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const { loadConfig } = require("../../../../translate/utils/load-config");
const { getAWSCredential } = require("../get-aws-credential");

const getDynamodbClient = async () => {
  const config = await loadConfig({ throw: true });

  const profileName = config?.cloud?.awsProfile;

  const credential = await getAWSCredential(profileName);

  const client = new DynamoDBClient({
    region: config?.cloud?.awsRegion,
    credentials: {
      accessKeyId: credential?.aws_access_key_id,
      secretAccessKey: credential?.aws_secret_access_key,
    },
  });

  return client;
};

module.exports = {
  getDynamodbClient,
};
