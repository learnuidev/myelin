const { loadConfig } = require("../../../../translate/utils/load-config");
const { getAWSCredential } = require("../get-aws-credential");

const getDynamodbClient = async () => {
  const config = await loadConfig({ throw: true });

  const profileName = config?.cloud?.provider;

  const credentials = getAWSCredential(profileName);
};
