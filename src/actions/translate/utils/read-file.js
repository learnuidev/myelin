/* eslint-disable no-useless-catch */
const fs = require("fs/promises");

async function readFile(filePath, opts = { throw: false }) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    if (opts.throw) {
      throw err;
    }
    return null;
  }
}

module.exports = {
  readFile,
};
