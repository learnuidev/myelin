const simpleGit = require("simple-git");
const fs = require("fs");

// Initialize simple-git
const git = simpleGit();

async function getUncommittedChanges(folderPath) {
  try {
    // Get the list of modified files in the working directory
    const status = await git.status();
    const modifiedFiles = status.modified.filter(
      (file) => file.startsWith(folderPath) && file.endsWith(".json")
    ); // Filter JSON files in the folder

    const results = [];

    for (const file of modifiedFiles) {
      // Get the last committed version of the file
      const lastCommittedContent = await git.show([`HEAD:${file}`]);

      // Read the current uncommitted version of the file
      const currentContent = fs.readFileSync(file, "utf-8");

      const fileNames = file?.split("/");
      const fileName = fileNames?.[fileNames?.length - 1];
      const nameSpace = fileName?.split(".")?.[0];

      results.push({
        path: file,
        fileName,
        nameSpace,
        lastContent: JSON.parse(lastCommittedContent),
        currentContent: JSON.parse(currentContent),
      });
    }

    return results;
  } catch (error) {
    console.error("Error retrieving uncommitted changes:", error);
    throw error;
  }
}

module.exports = {
  getUncommittedChanges,
};

// getUncommittedChanges("locales").then((resp) => {
//   console.log("res", resp);
// });
