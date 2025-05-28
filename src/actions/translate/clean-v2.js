const { note } = require("@clack/prompts");
const { loadConfig } = require("./utils/load-config");
const { cleanAndSave } = require("./utils/clean-and-save");

const cleanV2 = async (namespaces) => {
  // step 1: read config
  const config = await loadConfig();

  if (!config) {
    note(
      "myelin.config.json not found. Please run `npx myelino` to create one",
      "Error"
    );
    return null;
  }

  // Step 2: Translate and save
  await cleanAndSave({ config, namespaces: namespaces?.filter(Boolean) });
};

module.exports = {
  cleanV2,
};
