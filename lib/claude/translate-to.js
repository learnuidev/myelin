const {
  getPromptMessages,
} = require("../../src/actions/translate/utils/get-prompt-messages");
const { parseInput } = require("../../src/actions/translate/utils/parse-input");

const API_ENDPOINT = `https://api.anthropic.com`;

const translateTo = async ({
  apiKey,
  sourceTranslation,
  targetLanguage,
  model,
  maxTokens = 8192,
}) => {
  const promptMessages = getPromptMessages(
    {
      targetLanguage,
      sourceTranslation,
    },
    "claude"
  );

  const resp = await fetch(`${API_ENDPOINT}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": `${apiKey}`,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model || "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens || 1024,
      messages: promptMessages,
    }),
  });

  const respJson = await resp.json();

  return parseInput(respJson?.content?.[0]?.text);
};

module.exports = {
  translateTo,
};
