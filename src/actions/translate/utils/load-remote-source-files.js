const { loadConfig } = require("./load-config");
const {
  queryItemsByProjectId,
} = require("../../add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");

const loadRemoteSourceFiles = async () => {
  const config = await loadConfig();

  const items = await queryItemsByProjectId({ projectId: config.projectId });

  const filteredItems = items.filter(
    (item) =>
      item.lang === config?.locale?.sourceLanguage &&
      item.type === "folder" &&
      Object.keys(item.translations)?.length > 0
  );

  return filteredItems.map((item) => {
    return {
      fileName: item.fileName,
      baseFileName: item?.fileName?.split(".")?.[0],
      sourceTranslation: item?.translations,
    };
  });
};

module.exports = {
  loadRemoteSourceFiles,
};
