const ollama = require("ollama").default;

function parseDeepseekR1(inputString) {
  const arr = inputString?.split("\n");

  const finalString = arr?.[arr?.length - 1];

  return JSON.parse(finalString);
}

const ollamaRepository = () => {
  const translate = async ({ sourceTranslation, config, targetLanguage }) => {
    const prompt = `
    You are an expert language translator, given the stringified JSON object, translate the into the following language: ${targetLanguage}
  
    Please provide the response in stringified JSON format like so.
  
    For example, if the source translation is:
    { "title": "Heyy", "description:"Learn Anything" }
  
    And target language is "es", then it should return
    { "title": "Ey", "description": "Aprende cualquier cosa."}

    Please skip the thinking part and just return the answer
    
    `;

    const chatCompletion = await ollama.chat({
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

    const respObj = await parseDeepseekR1(chatCompletion?.message?.content);

    return respObj;
  };

  return {
    translate,
  };
};

module.exports = {
  ollamaRepository,
};
