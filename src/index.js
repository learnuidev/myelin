const { addComponent } = require("./actions/add-component");
const { listCustomTranslations } = require("./apis/list-custom-translations");
const { listTranslations } = require("./apis/list-translations");
const { loadTranslations } = require("./apis/load-translations");
const { upsertCustomTranslation } = require("./apis/upsert-custom-translation");

module.exports = {
  addComponent,
  loadTranslations,
  listTranslations,
  upsertCustomTranslation,
  listCustomTranslations,
};
