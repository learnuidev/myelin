const { select, note, multiselect, text, outro } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const picocolors = require("picocolors");
const {
  cloudProviderOptions,
} = require("../../constants/cloud-provider-options");

const addCloudProvider = async () => {
  const configExists = await loadConfig({ throw: true });

  const cloudProvider = await select({
    message: "Enter your cloud provider",
    options: cloudProviderOptions,
    placeholder: "fr, es, zh",
    validate: (value) => {
      if (!value) return "Please select at least one cloud provider";
      return;
    },
  });

  const fs = await require("node:fs/promises");

  const config = {
    ...configExists,
    cloudProvider,
  };

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify(config, null, 2),
    "utf-8"
  );

  outro(picocolors.green("Cloud successfully configured!"));
};

module.exports = {
  addCloudProvider,
};
