const { getPromptMessages } = require("../utils/get-prompt-messages");
const { loadClient } = require("../utils/load-client");
const { parseInput } = require("../utils/parse-input");
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

    const promptMessages = getPromptMessages({
      targetLanguage,
      sourceTranslation,
    });

    const chatCompletion = await client.chat.completions.create({
      messages: promptMessages,
      model: config?.aiProviders?.[targetLanguage]?.aiModel || config.aiModel,
    });

    const respObj = await parseInput(
      chatCompletion?.choices?.[0]?.message?.content
    );

    return respObj;
  };

  return {
    translate,
  };
};

module.exports = {
  openAiRepository,
};
