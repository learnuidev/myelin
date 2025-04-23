const { loadClient } = require("../utils/load-client");
const { loadTranslation } = require("../utils/load-translation");
const { parseInput } = require("../utils/parse-input");
const { writeJsonFile } = require("../utils/write-json-file");
// const { loadClient } = require("./load-client");

// const { parseInput } = require("./parse-input");

const openAiRepository = () => {
  const translate = async ({
    fileLocation,
    sourceTranslation,
    config,
    targetLanguage,
  }) => {
    const client = await loadClient({
      config,
      sourceTranslation,
      targetLanguage,
    });

    let originalExistingTranslation = await loadTranslation(fileLocation);

    let res = {
      ...originalExistingTranslation,
    };

    for (const keyVal of Object.entries(sourceTranslation)) {
      const [key, val] = keyVal;

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
            content: `source translation: ${JSON.stringify({ [key]: val })}`,
          },
        ],
        model: config?.aiProviders?.[targetLanguage]?.aiModel || config.aiModel,
      });

      const respObj = await parseInput(
        chatCompletion?.choices?.[0]?.message?.content
      );

      res[key] = respObj[key];

      await writeJsonFile(fileLocation, res);
    }

    return res;
  };

  return {
    translate,
  };
};

module.exports = {
  openAiRepository,
};
