const translateTo = async ({ text, targetLang = "en", xApiKey }) => {
  const url = `https://translate-pa.googleapis.com/v1/translateHtml`;

  const payload = [[[text], "auto", targetLang], "te_lib"];

  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "x-goog-api-key": xApiKey,
      "content-type": "application/json+protobuf",
    },
  });
  const data = await resp.json();
  return data?.[0]?.[0];
};

module.exports = {
  translateTo,
};
