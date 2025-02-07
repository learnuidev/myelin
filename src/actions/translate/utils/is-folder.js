const fs = require("fs/promises");
const { loadRemoteSourceFiles } = require("./load-remote-source-files");

async function isFolder(path, { remote }) {
  if (remote) {
    const items = await loadRemoteSourceFiles();
    return items?.length > 0;
  }

  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return false;
  }
}

module.exports = {
  isFolder,
};
