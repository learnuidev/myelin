const getProviderModelOptions = (aiProvider) => {
  switch (aiProvider) {
    case "openai":
    default:
      return [
        { value: "o3-mini", label: "o3 Mini" },
        { value: "o1", label: "o1" },
        { value: "o1-mini", label: "o1 Mini" },
        { value: "gpt-4o", label: "GTP 4o" },
        { value: "gpt-4o-mini", label: "GTP 4o Mini" },
        { value: "gpt-3.5-turbo", label: "GPT 3.5 Turbo" },
      ];
    case "deepseek":
      return [{ value: "deepseek-chat", label: "Deepseek Chat" }];
    case "moonshot":
      return [
        { value: "moonshot-v1-8k", label: "Moonshot 8k" },
        { value: "moonshot-v1-32k", label: "Moonshot 32k" },
        { value: "moonshot-v1-128k", label: "Moonshot 128k" },
        { value: "moonshot-v1-audi", label: "Moonshot Auto" },
      ];
    case "qwen":
      return [{ value: "qwen-plus", label: "Openai" }];
  }
};

module.exports = {
  getProviderModelOptions,
};
