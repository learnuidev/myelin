const {
  translationsTableName,
} = require("../../storage/dynamodb/translations-table");
const {
  queryItemsByProjectId,
} = require("../actions/add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");
const {
  listLocalTranslations,
} = require("../actions/sync/list-local-translations");

const { loadConfig } = require("../actions/translate/utils/load-config");

const { isLocalSync } = require("../utils/is-local-sync");

const listTranslations = async () => {
  const config = await loadConfig();

  if (isLocalSync({ config })) {
    const sourceTranslations = await listLocalTranslations({ config });

    return sourceTranslations.filter(
      (translation) => Object.keys(translation?.translations)?.length > 0
    );
  }

  const items = await queryItemsByProjectId({
    projectId: config.projectId,
    tableName: translationsTableName,
  });

  return items;
};

// const expected = [
//   {
//     projectId: "1a112464-0eac-4f24-a4e6-b6fd10dc0f22",
//     fileName: "common.json",
//     translations: { cta: "조용히 하고 내 돈을 가져가세요.", save: "저장" },
//     updatedAt: 1739032769281,
//     id: "1a112464-0eac-4f24-a4e6-b6fd10dc0f22#./locales/ko/common.json",
//     fileLocation: "./locales/ko/common.json",
//     lang: "ko",
//     type: "folder",
//   },
// ];

// listTranslations().then((trans) => {
//   console.log("trans", trans);
// });

module.exports = {
  listTranslations,
};
