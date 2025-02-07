const { removeNull } = require("../../../utils/remove-null");
const { loadConfig } = require("./load-config");

const updateConfig = async (newData) => {
  const fs = await require("node:fs/promises");
  const oldConfig = await loadConfig();

  const config = removeNull({
    ...oldConfig,
    ...newData,
  });

  await fs.writeFile(
    "myelin.config.json",
    JSON.stringify(config, null, 2),
    "utf-8"
  );

  return updateConfig;
};

module.exports = {
  updateConfig,
};
