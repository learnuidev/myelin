const fs = require("fs/promises");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

async function loadJsonFilesFromFolder(folderPath) {
  try {
    // Read the contents of the directory
    const files = await fs.readdir(folderPath);

    // Filter out only .json files
    const jsonFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".json"
    );

    // Read and parse each JSON file
    const jsonData = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        return {
          fileName: file,
          sourceTranslation: JSON.parse(fileContent),
        };
      })
    );

    return jsonData;
  } catch (error) {
    console.error("Error loading JSON files:", error);
    throw error;
  }
}

async function isFolder(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch (error) {
    // If there's an error (e.g., path does not exist), return false
    return false;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    // Get the directory path from the file path
    const dirPath = path.dirname(filePath);

    // Create the directory if it doesn't exist (recursively)
    await fs.mkdir(dirPath, { recursive: true });

    // Convert the data to a JSON string with pretty-printing (2 spaces indentation)
    const jsonString = JSON.stringify(data, null, 2);

    // Write the JSON string to the file
    await fs.writeFile(filePath, jsonString);

    console.log(`JSON file written successfully to ${filePath}`);
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

async function loadApiKey() {
  const aiApiKey = process.env.AI_API_KEY;

  if (!aiApiKey) {
    throw new Error("Api Key not found");
  }

  return aiApiKey;
}

async function loadConfig() {
  // step 1: read config
  const config = await readFile("myelin.config.json");

  if (!config) {
    throw new Error("config not found");
  }

  return JSON.parse(config);
}

const translationProviders = {
  openai: "openai",
  // anthorpic: "anthorpic",
  moonshot: "moonshot",
  deepseek: "deepseek",
  qwen: "qwen",
};

async function loadClient({ config }) {
  // 1. validate if the provider is supported
  if (!translationProviders?.[config.aiProvider]) {
    throw new Error(
      `Only the following ai providers are supported: ${JSON.stringify(Object.values(translationProviders))}`
    );
  }
  const apiKey = await loadApiKey();

  const client = await (() => {
    switch (config?.aiProvider) {
      case translationProviders.deepseek: {
        const client = new OpenAI({
          baseURL: "https://api.deepseek.com",
          apiKey: apiKey,
        });
        return client;
      }
      case translationProviders.moonshot: {
        const client = new OpenAI({
          baseURL: "https://api.moonshot.cn/v1",
          apiKey: apiKey,
        });
        return client;
      }
      case translationProviders.qwen: {
        const client = new OpenAI({
          baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
          apiKey: apiKey,
        });
        return client;
      }

      case translationProviders.openai:
      default: {
        const client = new OpenAI({
          apiKey: apiKey,
        });
        return client;
      }
    }
  })();

  return client;
}

async function loadSourceTranslation({ config }) {
  const localeLocation = config.locale.location;
  const sourceLanguage = config.locale.sourceLanguage;

  const sourceTranslation = await readFile(
    `./${localeLocation}/${config.locale.sourceLanguage}.json`
  );

  if (!sourceTranslation) {
    throw new Error(`Translation not found`);
  }

  return JSON.parse(sourceTranslation);
}

function parseInput(input) {
  // Remove the surrounding code block markers (```)
  const cleanedInput = input
    .replace(/^```json\n|\n```$/g, "")
    ?.replaceAll("\n", "")
    ?.replaceAll("```", "");

  return JSON.parse(cleanedInput);
}

const translateText = async ({ sourceTranslation, config, targetLanguage }) => {
  const client = await loadClient({ config });

  const prompt = `
  You are an expert language translator, given the stringified JSON object, translate the into the following language: ${targetLanguage}

  Please provide the response in stringified JSON format like so.

  For example, if the source translation is:
  { "title": "Heyy", "description:"Learn Anything" }

  And target language is "es", then it should return
  { "title": "Ey", "description": "Aprende cualquier cosa."}
  
  `;

  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `${prompt}`,
      },
      {
        role: "user",
        content: `source translation: ${JSON.stringify(sourceTranslation)}`,
      },
    ],
    model: config.aiModel,
  });

  const respObj = await parseInput(
    chatCompletion?.choices?.[0]?.message?.content
  );

  return respObj;
};

const translateAndSave = async ({ config }) => {
  // Flow for folder level
  const localeLocation = config.locale.location;
  const sourceLanguage = config.locale.sourceLanguage;

  const sourceFolderPath = `./${localeLocation}/${sourceLanguage}`;

  const _isFolder = await isFolder(`./${localeLocation}/${sourceLanguage}`);

  if (_isFolder) {
    const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);
    console.log("HANDLE FOLDER LEVEL TRANSLATION", sourceTranslations);

    await Promise.all(
      config.locale.targetLanguages.map(async (targetLanguage) => {
        await Promise.all(
          sourceTranslations?.map(async (sourceTranslationAndFileName) => {
            const { fileName, sourceTranslation } =
              sourceTranslationAndFileName;

            const translation = await translateText({
              sourceTranslation,
              config,
              targetLanguage,
            });

            await writeJsonFile(
              `./${localeLocation}/${targetLanguage}/${fileName}`,
              translation
            );
            return true;
          })
        );
      })
    );

    console.log(
      `Succcessfully translated the following languages: ${JSON.stringify(config.locale.targetLanguages)}`
    );

    return true;
  }

  // Flow for file level translation
  const sourceTranslation = await loadSourceTranslation({ config });

  await Promise.all(
    config.locale.targetLanguages.map(async (targetLanguage) => {
      const translation = await translateText({
        sourceTranslation,
        config,
        targetLanguage,
      });

      await writeJsonFile(
        `./${localeLocation}/${targetLanguage}.json`,
        translation
      );
      return true;
    })
  );

  console.log(
    `Succcessfully translated the following languages: ${JSON.stringify(config.locale.targetLanguages)}`
  );
};

const translate = async () => {
  // step 1: read config
  const config = await loadConfig();

  // Step 2: Translate and save
  await translateAndSave({ config });
};

module.exports = {
  translate,
};
