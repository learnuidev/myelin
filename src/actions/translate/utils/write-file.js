const fs = require("fs/promises");
const path = require("path");

async function writeFile(filePath, data) {
  // Get the directory path from the file path
  const dirPath = path.dirname(filePath);

  // Create the directory if it doesn't exist (recursively)
  await fs.mkdir(dirPath, { recursive: true });

  // Write the JSON string to the file
  await fs.writeFile(filePath, data);

  console.log(`File written successfully to ${filePath}`);
}

module.exports = {
  writeFile,
};
