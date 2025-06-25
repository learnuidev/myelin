const fs = require("fs/promises");

async function removeDirectory(path) {
  await fs.rm(path, { recursive: true, force: true });
}

module.exports = {
  removeDirectory,
};
