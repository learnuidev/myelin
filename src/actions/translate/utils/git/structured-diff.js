const simpleGit = require("simple-git");
const git = simpleGit();

function parseKeyValue(line) {
  try {
    const cleanedLine = line.replace(/,\s*$/, "");
    const wrapped = `{${cleanedLine}}`;
    const parsed = JSON.parse(wrapped);
    const entries = Object.entries(parsed);
    if (entries.length === 1) {
      return { key: entries[0][0], value: entries[0][1] };
    }
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return null;
  }
  return null;
}

function parseGitDiff(diffInput) {
  const resultMap = new Map();

  const sections = diffInput.split(/\n(?=.*? --- )/g);

  for (const section of sections) {
    const lines = section.split("\n");
    const header = lines[0];
    const fileNameMatch = header.match(/^([^\s]+)/);
    if (!fileNameMatch) continue;
    const fileName = fileNameMatch[1];
    if (!fileName.endsWith(".json")) continue;

    let changes = resultMap.get(fileName) || [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const lineMatch = line.match(
        /^\s*(\d+|\.{2,})\s+(.*?)\s+(\d+|\.{2,})\s+(.*)$/
      );
      if (!lineMatch) continue;

      // const oldLine = lineMatch[1];
      const oldContent = lineMatch[2].trim();
      const newLine = lineMatch[3];
      const newContent = lineMatch[4].trim();

      if (oldContent === newContent) continue;

      if (!/^\d+$/.test(newLine)) continue;

      const parsed = parseKeyValue(newContent);
      const oldParsed = parseKeyValue(oldContent);
      if (parsed) {
        changes.push({
          lineNumber: parseInt(newLine, 10),
          key: parsed.key,
          newValue: parsed.value,
          oldValue: oldParsed?.value,
        });
      }
    }

    if (changes.length > 0) {
      resultMap.set(fileName, changes);
    }
  }

  const result = [];
  for (const [file, fileChanges] of resultMap.entries()) {
    result.push({
      file,
      changes: fileChanges,
    });
  }

  return result;
}

async function structuredDiff() {
  const diff = await git.diff();
  return parseGitDiff(diff);
}

module.exports = {
  structuredDiff,
};
