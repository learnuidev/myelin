const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const { components } = require("../components");

const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

async function installDependencies(deps) {
  const script = `npm install ${deps?.join(" ")}`;

  try {
    await execAsync(script);
    console.log("Dependencies installed successfully!");
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error(error);
    // console.error("Installation failed:", error.stderr || error.message);
  }
}

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

  if (["next-i18n", "copy-text-to-clipboard"]?.includes(name)) {
    // install dependencies
    if (component.dependencies) {
      await installDependencies(component.dependencies);
    }

    // add codes
    if (component.codes) {
      await Promise.all(
        component.codes.map(async (code) => {
          const codeRaw = await fetch(code.codeUrl);
          const codeRawStr = await codeRaw.text();

          if (!existsSync(code.targetDir)) {
            await fs.mkdir(code.targetDir, { recursive: true });
          }

          fs.writeFile(code.path, codeRawStr).then(() => {
            console.log(`${name}: successfully installed`);
          });
        })
      );
    }

    return null;
  }

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
