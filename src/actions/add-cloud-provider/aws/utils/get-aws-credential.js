const { listAWSCredentials } = require("./list-aws-credentials");
const { loadAWSCredentials } = require("./load-aws-credentials");

const getAWSCredential = async (id) => {
  const awsCredentials = await listAWSCredentials();

  const awsCredits = await loadAWSCredentials();

  const credential = awsCredentials?.find((awsProfile) => {
    return awsProfile.id === id;
  });

  if (!credential) {
    throw new Error("AWS Credential not found");
  }

  return credential;
};

module.exports = {
  getAWSCredential,
};
