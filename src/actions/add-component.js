const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const { components } = require("../components");

const { exec } = require("child_process");
const { promisify } = require("util");
const { log, spinner, select } = require("@clack/prompts");
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

async function installMyelinDependencies(deps) {
  for (const dep of deps) {
    const script = `npx myelino add ${dep}`;

    const s = spinner();

    try {
      s.start(`Installing ${dep}`);

      await execAsync(script);
      s.stop("Dependencies installed successfully!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new Error(error);
      // console.error("Installation failed:", error.stderr || error.message);
    }
  }
}

const addComponent = async (name, componentType) => {
  // return;
  const component = components[name];
  if (!component) {
    log.error(`Component: ${name} does not exist`);
    log.info(
      `The following components are currently supported: ${JSON.stringify(Object.keys(components))}`
    );
    return null;
  }

  let pathName;

  if (component.version === 2) {
    if (name === "i18next") {
      let componentVariant = componentType;

      if (!componentVariant) {
        componentVariant = await select({
          message: "Please enter your framework",
          placeholder: "nextjs",
          options: [
            { value: "nextjs", label: "NextJS" },
            { value: "tanstack", label: "Tanstack Start" },
          ],
        });
      }

      if (!["nexjs", "tanstack"]?.includes(componentVariant)) {
        log.error(`Invalid framework provider: ${componentVariant}`);

        componentVariant = await select({
          message: "Please enter your framework",
          placeholder: "nextjs",
          options: [
            { value: "nextjs", label: "NextJS" },
            { value: "tanstack", label: "Tanstack Start" },
          ],
        });
      }

      if (componentVariant) {
        const variant = component?.variants?.[componentVariant];

        if (!variant?.codes?.length) {
          throw new Error(
            `Code for this variant ${componentVariant} for ${name} doesnt exist`
          );
        }

        log.info(`Installing: ${name}... please wait`);

        if (variant.dependencies?.length) {
          await installDependencies(variant.dependencies);
        }

        await Promise.all(
          variant?.codes.map(async (code) => {
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

        return null;
      }
    }

    log.info(`Installing: ${name}... please wait`);

    // install dependencies
    if (component.dependencies?.length) {
      await installDependencies(component.dependencies);
    }

    if (component.myelinDependencies) {
      await installMyelinDependencies(component.myelinDependencies);
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
