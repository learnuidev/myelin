const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const { components } = require("../components");

const { exec } = require("child_process");
const { promisify } = require("util");
const { log, spinner } = require("@clack/prompts");
const execAsync = promisify(exec);

async function installDependencies(deps) {
  const script = `npm install ${deps?.join(" ")}`;

  const s = spinner();

  try {
    s.start(`Installing dependencies...`);

    await execAsync(script);
    s.stop("Dependencies installed successfully!");
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error(error);
    // console.error("Installation failed:", error.stderr || error.message);
  }
}

const addComponent = async (name) => {
  const component = components[name];
  if (!component) {
    log.error(`Component: ${name} does not exist`);
    log.info(
      `The following components are currently supported: ${JSON.stringify(Object.keys(components))}`
    );
    return null;
  }

  log.info(`Installing: ${name}... please wait`);

  let pathName;

  if (component.version === 2) {
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
            log.success(`${name}: successfully installed`);
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
    log.success(`${name}: successfully installed`);
  });
};

module.exports.addComponent = addComponent;
