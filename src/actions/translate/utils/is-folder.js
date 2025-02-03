const fs = require("fs/promises");

async function isFolder(path) {
  const stats = await fs.stat(path);
  return stats.isDirectory();
}

module.exports = {
  isFolder,
};
