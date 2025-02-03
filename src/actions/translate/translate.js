const { loadConfig } = require("./utils/load-config");
const { translateAndSave } = require("./utils/translate-and-save");

const translate = async () => {
  // step 1: read config
  const config = await loadConfig();

  // Step 2: Translate and save
  await translateAndSave({ config });
};

module.exports = {
  translate,
};
