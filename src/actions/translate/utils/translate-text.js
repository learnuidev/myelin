const { loadClient } = require("./load-client");

const { parseInput } = require("./parse-input");

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

module.exports = {
  translateText,
};
