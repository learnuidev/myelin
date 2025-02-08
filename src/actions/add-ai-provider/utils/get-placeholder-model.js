const getPlaceholderModel = (aiProvider) => {
  switch (aiProvider) {
    case "openai":
    default:
      return "gpt-4o-mini";
    case "deepseek":
      return "deekseek-chat";
    case "moonshot":
      return "moonshot-v1-auto";
    case "qwen":
      return "qwen-plus";
  }
};

module.exports = {
  getPlaceholderModel,
};
