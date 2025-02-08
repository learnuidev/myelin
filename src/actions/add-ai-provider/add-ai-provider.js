const { outro } = require("@clack/prompts");
const { removeNull } = require("../../utils/remove-null");
const { loadConfig } = require("../translate/utils/load-config");
const { addAiProviderCli } = require("./utils/add-ai-provider-cli");
const picocolors = require("picocolors");
const {
  addAiProviderSuccessLog,
} = require("./utils/add-ai-provider-success-log");

const addAiProvider = async () => {
  const configExists = await loadConfig();
  const { aiModel, aiProvider, customAiUrl } = await addAiProviderCli();

  const config = removeNull({
    ...configExists,
    aiProvider,
    aiModel,
    customAiUrl,
  });

  const fs = await require("node:fs/promises");

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify(config, null, 2),
    "utf-8"
  );

  outro(
    picocolors.green(
      `AI provider: ${aiProvider} [${aiModel}] was configured successfully!`
    )
  );

  addAiProviderSuccessLog(config);
};

module.exports = {
  addAiProvider,
};
