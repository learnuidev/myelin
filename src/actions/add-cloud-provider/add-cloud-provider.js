const { select, note, multiselect, text, outro } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const picocolors = require("picocolors");
const {
  cloudProviderOptions,
} = require("../../constants/cloud-provider-options");
const { listAWSCredentials } = require("./aws/utils/list-aws-credentials");
const { listAWSProfiles } = require("./aws/utils/list-aws-profiles");
const { awsRegions } = require("./aws/constants/aws-regions");

const addCloudProvider = async () => {
  const fs = await require("node:fs/promises");

  const configExists = await loadConfig({ throw: true });

  const cloudProvider = await select({
    message: "Enter your cloud provider",
    options: cloudProviderOptions,
    validate: (value) => {
      if (!value) return "Please select at least one cloud provider";
      return;
    },
  });

  let awsProfile;
  let awsRegion;

  let awsProfiles = await listAWSProfiles();

  if (cloudProvider === "aws") {
    awsProfile = await select({
      message: "Enter your aws profile",
      options: awsProfiles,
      validate: (value) => {
        if (!value) return "Please select at least one profile";
        return;
      },
    });

    awsRegion = await select({
      message: "Enter your aws region",
      options: awsRegions,
      validate: (value) => {
        if (!value) return "Please select at least one region";
        return;
      },
    });
  }

  const config = {
    ...configExists,
    cloud: {
      provider: cloudProvider,
      awsProfile,
      awsRegion,
    },
  };

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify(config, null, 2),
    "utf-8"
  );

  outro(
    picocolors.green(`Cloud [${cloudProvider}] was configured successfully!`)
  );
};

module.exports = {
  addCloudProvider,
};
