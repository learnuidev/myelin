const { addComponent } = require("./actions/add-component");
const { listTranslations } = require("./apis/list-translations");
const { loadTranslations } = require("./apis/load-translations");

module.exports = {
  addComponent,
  loadTranslations,
  listTranslations,
};
