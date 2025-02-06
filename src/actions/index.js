const { addComponent } = require("./add-component");
const { getComponent } = require("./get-component");
const { listDirectoryNames } = require("./list-directory-names");
const { translate } = require("./translate/translate");
const { updateComponent } = require("./update-component/update-component");
const { upsertComponent } = require("./upsert-component/upsert-component");

module.exports = {
  addComponent,
  translate,
  listDirectoryNames,
  getComponent,
  updateComponent,
  upsertComponent,
};
