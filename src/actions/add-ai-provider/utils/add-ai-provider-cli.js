const { select, text } = require("@clack/prompts");
const { getPlaceholderModel } = require("./get-placeholder-model");
const { getProviderModelOptions } = require("./get-provider-model-options");
const {
  listOllamaModels,
} = require("../../../../lib/ollama/list-ollama-models");
const { languageOptions } = require("../../../constants/language-options");
const { removeNull } = require("../../../utils/remove-null");

const getAiProviderAndModel = async ({ targetLanguage }) => {
  const languageOption = languageOptions?.find(
    (lang) => lang?.value === targetLanguage
  );
  const aiProvider = await select({
    message: targetLanguage
      ? `Enter your ai provider for ${languageOption?.label}`
      : "Enter your ai provider",
    placeholder: "deepseek",
    options: [
      { value: "openai", label: "Openai" },
      { value: "deepseek", label: "Deepseek" },
      { value: "qwen", label: "Qwen" },
      { value: "moonshot", label: "Moonshot" },
      { value: "ollama", label: "Ollama" },
      { value: "custom", label: "Custom" },
    ],
  });

  let aiModel;

  if (!["custom", "ollama"]?.includes(aiProvider)) {
    aiModel = await select({
      message: "Enter your preferred ai model",
      placeholder: getPlaceholderModel(aiProvider),
      options: getProviderModelOptions(aiProvider),
    });
  }

  if (aiProvider === "ollama") {
    const ollamaModels = await listOllamaModels();

    aiModel = await select({
      message: "Enter your preferred ai model",
      placeholder: ollamaModels?.[0]?.modelName,
      options: ollamaModels.map((model) => {
        return {
          value: model.modelName,
          label: model.modelName,
        };
      }),
    });

    // aiModel = await text({
    //   message: "Enter the your local model",
    //   placeholder: "deepseek-r1:32b",
    //   validate: (value) => {
    //     if (!value) return "This cannot be empty";
    //     return;
    //   },
    // });
  }

  let customAiUrl;

  if (aiProvider === "custom") {
    customAiUrl = await text({
      message: "Enter the url of your custom ai model",
      placeholder: "https://www.myaimodel.com",
      validate: (value) => {
        if (!value) return "This cannot be empty";
        return;
      },
    });
  }

  return {
    aiProvider,
    aiModel,
    customAiUrl,
  };
};

const addAiProviderCli = async ({ targetLanguages }) => {
  if (targetLanguages?.length > 1) {
    const addProviderPerLang = await select({
      message:
        "You have selected more than one languages, would you like to add provider per language",
      placeholder: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    });

    if (addProviderPerLang === "yes") {
      let aiProviders = targetLanguages.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: {},
        };
      }, {});

      for (const targetLanguage of targetLanguages) {
        const { aiProvider, aiModel, customAiUrl } =
          await getAiProviderAndModel({ targetLanguage });

        aiProviders = {
          ...aiProviders,
          [targetLanguage]: removeNull({
            aiModel,
            aiProvider,
            customAiUrl,
          }),
        };
      }

      return {
        aiProviders,
      };
    }
  }

  const { aiProvider, aiModel, customAiUrl } = await getAiProviderAndModel({
    targetLanguage: null,
  });

  return {
    aiProvider,
    aiModel,
    customAiUrl,
  };
};

module.exports = {
  addAiProviderCli,
};
