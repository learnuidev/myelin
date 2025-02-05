const {
  getSourceFolderPath,
} = require("../../../translate/utils/get-source-folder-path");
const { isFolder } = require("../../../translate/utils/is-folder");
const { loadConfig } = require("../../../translate/utils/load-config");
const { writeFile } = require("../../../translate/utils/write-file");
const { generatei18nModule } = require("./utils/generate-i18n-module");

const upserti18Next = async (name = "i18next.d.ts") => {
  // 1. load config
  const config = await loadConfig();

  const sourceFolderPath = getSourceFolderPath({ config });

  const _isFolder = await isFolder(sourceFolderPath);

  if (_isFolder) {
    const code = await generatei18nModule({ config });

    await writeFile(`./types/${name}`, code);
  }

  return true;
};

module.exports = {
  upserti18Next,
};
