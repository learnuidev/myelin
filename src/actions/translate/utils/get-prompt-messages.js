const getPromptMessages = ({ targetLanguage, sourceTranslation }, variant) => {
  const prompt = `
  You are an expert language translator, given the stringified JSON object, translate the into the following language: ${targetLanguage}

  Please provide the response in stringified JSON format like so.

  For example, if the source translation is:
  { "title": "Heyy", "description:"Learn Anything" }

  And target language is "es", then it should return
  { "title": "Ey", "description": "Aprende cualquier cosa."}
  
  `;

  if (variant === "claude") {
    return [
      {
        role: "user",
        content: `prompt: ${prompt},
        source translation: ${JSON.stringify(sourceTranslation)}


      `,
      },
    ];
  }

  return [
    {
      role: "system",
      content: `${prompt}`,
    },
    {
      role: "user",
      content: `source translation: ${JSON.stringify(sourceTranslation)}`,
    },
  ];
};

module.exports = {
  getPromptMessages,
};
