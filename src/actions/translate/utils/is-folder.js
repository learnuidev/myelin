const fs = require("fs/promises");

async function isFolder(path) {
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
