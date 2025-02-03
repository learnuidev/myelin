const fs = require("fs/promises");
const path = require("path");

async function writeJsonFile(filePath, data) {
  // Get the directory path from the file path
  const dirPath = path.dirname(filePath);

  // Create the directory if it doesn't exist (recursively)
  await fs.mkdir(dirPath, { recursive: true });

  // Convert the data to a JSON string with pretty-printing (2 spaces indentation)
  const jsonString = JSON.stringify(data, null, 2);

  // Write the JSON string to the file
  await fs.writeFile(filePath, jsonString);

  console.log(`JSON file written successfully to ${filePath}`);
}

module.exports = {
  writeJsonFile,
};
