const fs = require("fs").promises;
const path = require("path");
const { components } = require("../components");
const { importAsString } = require("../utils/import-as-string");

const url =
  "https://raw.githubusercontent.com/learnuidev/myelin/refs/heads/main/src/components";

const addComponent = async (name) => {
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

  // try {
  //   const resp = await fetch(`${url}/${component?.path}`);
  //   const code = await resp.text();

  //   fs.writeFile(pathName, code).then(() => {
  //     console.log(`${name}: successfully installed from cloud`);
  //   });
  // } catch (err) {
  //   fs.writeFile(pathName, component?.code).then(() => {
  //     console.log(`${name}: successfully installed`);
  //   });
  // }

  // try {
  //   // try importing locally
  //   const code = await importAsString(`../components/${component?.path}`);

  //   fs.writeFile(pathName, code)
  //     .then(() => {
  //       console.log(`${name}: successfully installed from locally`);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // } catch (err) {
  //   try {
  //     const resp = await fetch(`${url}/${component?.path}`);
  //     const code = await resp.text();

  //     fs.writeFile(pathName, code).then(() => {
  //       console.log(`${name}: successfully installed from cloud`);
  //     });
  //   } catch (err) {
  //     fs.writeFile(pathName, component?.code).then(() => {
  //       console.log(`${name}: successfully installed`);
  //     });
  //   }
  // }
};

module.exports.addComponent = addComponent;
