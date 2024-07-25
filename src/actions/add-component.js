const fs = require("fs").promises;
const path = require("path");

const addComponent = (name) => {
  console.log(`Installing: ${name}... please wait`);

  const pathName = path.resolve(`./components/${name}.tsx`);

  fs.writeFile(pathName, "todo").then(() => {
    console.log(`${name}: successfully installed`);
  });
};

module.exports.addComponent = addComponent;
