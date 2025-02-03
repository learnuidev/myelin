const fs = require("fs/promises");

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

module.exports = {
  readFile,
};
