const {
  translationsTableName,
} = require("../../../../storage/dynamodb/translations-table");
const {
  getItem,
} = require("../../add-cloud-provider/aws/utils/dynamodb/get-item");
const { readFile } = require("./read-file");

// const sourceTranslation = {
//   titleInformal: "Yo whats good!",
//   description: "Learn Anything",
//   "cta.button": "Start here",
//   "cta.cancel": "Cancel",
//   banner: "Victoria is awesome",
//   "banner.description": "This banner is awesome my friends",
// };

async function loadSourceTranslation(
  { config },
  { remote } = { remote: false }
) {
  const localeLocation = config.locale.location;
  const sourceTranslationKey = `./${localeLocation}/${config.locale.sourceLanguage}.json`;

  if (remote) {
    const sourceTranslationRemote = await getItem({
      tableName: translationsTableName,
      partitionKey: {
        id: sourceTranslationKey,
      },
      sortKey: {
        projectId: config.projectId,
      },
    });

    const sourceTranslation = JSON.parse(sourceTranslationRemote?.translations);

    return sourceTranslation;
  }

  let sourceTranslation;

  try {
    sourceTranslation = await readFile(sourceTranslationKey);

    return JSON.parse(sourceTranslation);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return null;
  }
}

module.exports = {
  loadSourceTranslation,
};
