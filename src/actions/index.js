const { addComponent } = require("./add-component");
const { init } = require("./init/init");
const { translate } = require("./translate/translate");
const { upsertComponent } = require("./upsert-component/upsert-component");

module.exports = {
  addComponent,
  translate,
  upsertComponent,
  init,
};
