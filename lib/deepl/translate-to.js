const API_ENDPOINT = `https://api-free.deepl.com`;

// for paid version
// const API_ENDPOINT = `https://api.deepl.com`;

const translateTo = async ({ apiKey, text, targetLang }) => {
  const resp = await fetch(`${API_ENDPOINT}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
    }),
  });

  const respJson = await resp.json();

  return respJson.translations[0].text;
};

module.exports = {
  translateTo,
};
