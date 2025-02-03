/* eslint-disable no-useless-catch */
const fs = require("fs/promises");

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  readFile,
};
