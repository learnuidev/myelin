const fs = require("fs/promises");
const path = require("path");
const { writeFile } = require("./write-file");

async function writeJsonFile(filePath, data) {
  // Get the directory path from the file path
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  writeJsonFile,
};
