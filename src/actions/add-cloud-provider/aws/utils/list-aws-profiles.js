const { listAWSCredentials } = require("./list-aws-credentials");

const listAWSProfiles = async () => {
  const awsCredentials = await listAWSCredentials();

  return awsCredentials?.map((awsProfile) => {
    return {
      value: awsProfile.id,
      label: awsProfile.id,
    };
  });
};

module.exports = {
  listAWSProfiles,
};
