const { upserti18Next } = require("./actions/upsert-i18next/upsert-i18next");

const upsertComponent = async (name) => {
  if (name === "i18next.d.ts") {
    upserti18Next(name);

    return null;
  }

  console.log("Currently not supported");
};

module.exports.upsertComponent = upsertComponent;
