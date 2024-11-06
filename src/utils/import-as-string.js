const readFile = require("fs/promises").readFile;

async function importAsString(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    return content;
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}

module.exports = {
  importAsString,
};
