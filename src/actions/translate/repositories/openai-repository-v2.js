const { loadClient } = require("../utils/load-client");

// const { loadClient } = require("./load-client");

// const { parseInput } = require("./parse-input");

const openAiRepositoryV2 = () => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    const client = await loadClient({
      config,
      sourceTranslation,
      targetLanguage,
    });

    let res = {};

    for (const keyVal of Object.entries(sourceTranslation)) {
      const [key, val] = keyVal;

      const prompt = `
      You are an expert language translator, given the string, translate the into the following language: ${targetLanguage}
    
      Please provide only the translated string
    
      For example, if the source translation is: Learn Anything
    
      And target language is "es", then it should return: Aprende cualquier cosa.
      
      `;

      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `${prompt}`,
          },
          {
            role: "user",
            content: `input string: ${val}`,
          },
        ],
        model: config?.aiProviders?.[targetLanguage]?.aiModel || config.aiModel,
      });

      const resp = chatCompletion?.choices?.[0]?.message?.content;

      res[key] = resp;
    }

    return res;
  };

  return {
    translate,
  };
};

module.exports = {
  openAiRepositoryV2,
};
