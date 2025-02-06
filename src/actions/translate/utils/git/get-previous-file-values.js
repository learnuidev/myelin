const simpleGit = require("simple-git");
const git = simpleGit();
const fs = require("fs");
const path = require("path");

async function getPreviousFileValues(folderPath) {
  try {
    // Get the list of files changed in the last commit
    const diffSummary = await git.diffSummary([
      "HEAD^",
      "HEAD",
      "--",
      folderPath,
    ]);

    const files = diffSummary.files
      // .filter((file) => file.file.endsWith(".json")) // Filter only JSON files
      .map((file) => file.file);

    const results = [];

    for (const file of files) {
      // Get the previous version of the file
      const previousContent = await git.show([`HEAD^:${file}`]);

      // Read the current version of the file
      const currentContent = fs.readFileSync(file, "utf-8");

      results.push({
        path: file,
        previousContent: JSON.parse(previousContent),
        currentContent: JSON.parse(currentContent),
      });
    }

    return results;
  } catch (error) {
    console.error("Error retrieving previous file values:", error);
    throw error;
  }
}

module.exports = {
  getPreviousFileValues,
};

getPreviousFileValues("./locales").then((resp) => {
  console.log("res", resp);
});
