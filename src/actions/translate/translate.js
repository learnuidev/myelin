const { note } = require("@clack/prompts");
const { loadConfig } = require("./utils/load-config");
const { translateAndSave } = require("./utils/translate-and-save");

const translate = async () => {
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
  await translateAndSave({ config });
};

module.exports = {
  translate,
};
