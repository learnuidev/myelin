const { exec } = require("child_process");

function parseModelsString(modelsString) {
  // Split the string into lines
  const lines = modelsString.trim().split("\n");

  // Skip the header line
  const dataLines = lines.slice(1);

  // Parse each line into an object
  const models = dataLines.map((line) => {
    const parts = line.trim().split(/\s{2,}/); // Split by two or more spaces
    return {
      modelName: parts[0],
      id: parts[1],
      size: parts[2],
      modified: parts[3],
    };
  });

  return models;
}

async function listOllamaModels() {
  try {
    // Execute the command to list models
    const output = await new Promise((resolve, reject) => {
      exec("ollama list", (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    // console.log(output);
    return parseModelsString(output);
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}

module.exports = {
  listOllamaModels,
};

// listOllamaModels().then((models) => {
//   console.log("MODELS", models);
// });
