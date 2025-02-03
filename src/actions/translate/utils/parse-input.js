function parseInput(input) {
  // Remove the surrounding code block markers (```)
  const cleanedInput = input
    .replace(/^```json\n|\n```$/g, "")
    ?.replaceAll("\n", "")
    ?.replaceAll("```", "");

  return JSON.parse(cleanedInput);
}

module.exports = {
  parseInput,
};
