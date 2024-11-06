const fs = require("fs").promises;
const path = require("path");
const { components } = require("../components");

const addComponent = (name) => {
  const component = components[name];
  if (!component) {
    console.log(`Component: ${name} does not exist`);
    console.log(
      `The following components are currently supported: ${JSON.stringify(Object.keys(components))}`
    );
    return null;
  }

  console.log(`Installing: ${name}... please wait`);

  let pathName;

  if (name === "leitner") {
    pathName = path.resolve(`./components/${name}.js`);
  } else {
    pathName = path.resolve(`./components/${name}.tsx`);
  }

  fs.writeFile(pathName, component?.code).then(() => {
    console.log(`${name}: successfully installed`);
  });
};

module.exports.addComponent = addComponent;
