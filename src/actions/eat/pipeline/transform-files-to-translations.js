const fs = require("fs");
const path = require("path");
const babel = require("@babel/parser");
const traverseModule = require("@babel/traverse");
const glob = require("fast-glob");

const traverse = traverseModule.default || traverseModule;

const TRANSLATABLE_ATTRIBUTES = ["alt", "title", "placeholder", "aria-label"];

function extractStringsFromJSX(filePath) {
  const code = fs.readFileSync(filePath, "utf8");

  const ast = babel.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const extracted = {};
  const fileName = path
    .basename(filePath, path.extname(filePath))
    .toLowerCase();

  let currentFunction = null;
  const elementCounts = {};

  function addExtractedText(
    parentKey,
    elementName,
    text,
    location,
    attributeName
  ) {
    if (!text.trim()) return;

    if (!elementCounts[parentKey]) {
      elementCounts[parentKey] = {};
    }
    if (!elementCounts[parentKey][elementName]) {
      elementCounts[parentKey][elementName] = 0;
    }

    elementCounts[parentKey][elementName]++;

    if (!extracted[parentKey]) {
      extracted[parentKey] = {};
    }

    const count = elementCounts[parentKey][elementName];
    let childKey = count > 1 ? `${elementName}_${count - 1}` : elementName;

    if (attributeName) {
      childKey = `${childKey}_${attributeName.replace(/-/g, "_")}`;
    }

    extracted[parentKey][childKey] = {
      text,
      filepath: filePath,
      location,
    };
  }

  traverse(ast, {
    FunctionDeclaration(path) {
      const id = path.node.id;
      currentFunction = id?.name?.toLowerCase() || null;
      if (currentFunction) {
        elementCounts[currentFunction] = {};
      }
    },
    FunctionExpression(path) {
      const parent = path.parent;
      const id = parent.id;
      currentFunction = id?.name?.toLowerCase() || null;
      if (currentFunction) {
        elementCounts[currentFunction] = {};
      }
    },
    ArrowFunctionExpression(path) {
      if (path.parent.type === "VariableDeclarator") {
        const parent = path.parent;
        const id = parent.id;
        currentFunction = id?.name?.toLowerCase() || null;
        if (currentFunction) {
          elementCounts[currentFunction] = {};
        }
      }
    },
    JSXText(path) {
      const trimmedText = path.node.value.trim();
      if (trimmedText) {
        const parentKey = currentFunction || fileName;

        let currentPath = path.parentPath;
        let elementName = "text";

        while (currentPath) {
          const node = currentPath.node;
          if (node.type === "JSXElement") {
            const element = node.openingElement;
            if (element.name.type === "JSXIdentifier") {
              elementName = element.name.name.toLowerCase();
              break;
            }
          }
          currentPath = currentPath.parentPath;
        }

        addExtractedText(parentKey, elementName, trimmedText, {
          start: path.node.start,
          end: path.node.end,
        });
      }
    },
    JSXAttribute(path) {
      const attrName = path.node.name.name;
      const attrValue = path.node.value;

      if (
        TRANSLATABLE_ATTRIBUTES.includes(attrName) &&
        attrValue?.type === "StringLiteral" &&
        attrValue.value.trim()
      ) {
        const parentKey = currentFunction || fileName;
        let elementName = "unknown";

        let currentPath = path.parentPath;
        while (currentPath) {
          const node = currentPath.node;
          if (node.type === "JSXOpeningElement") {
            const element = node;
            if (element.name.type === "JSXIdentifier") {
              elementName = element.name.name.toLowerCase();
              break;
            }
          }
          currentPath = currentPath.parentPath;
        }

        addExtractedText(
          parentKey,
          elementName,
          attrValue.value,
          {
            start: attrValue.start,
            end: attrValue.end,
          },
          attrName
        );
      }
    },
  });
  return extracted;
}

async function processDirectory(folderPath) {
  const files = await glob([`${folderPath}/**/*.{tsx,jsx}`], {
    absolute: true,
  });
  const allResults = {};

  for (const file of files) {
    try {
      const result = extractStringsFromJSX(file);
      Object.assign(allResults, result);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  return allResults;
}

async function applyTranslations(extractedStrings) {
  const fileCache = {};
  const replacements = [];

  for (const [componentName, componentStrings] of Object.entries(
    extractedStrings
  )) {
    for (const [stringKey, stringData] of Object.entries(componentStrings)) {
      const { filepath, location, text } = stringData;
      const translationKey = `${componentName}.${stringKey}`;

      replacements.push({
        filepath,
        start: location.start,
        end: location.end,
        replacement: `{t('${translationKey}')}`,
      });
    }
  }

  replacements.sort((a, b) => {
    if (a.filepath !== b.filepath) return a.filepath.localeCompare(b.filepath);
    return b.start - a.start;
  });

  for (const { filepath, start, end, replacement } of replacements) {
    if (!fileCache[filepath]) {
      fileCache[filepath] = fs.readFileSync(filepath, "utf8");
    }

    const content = fileCache[filepath];
    fileCache[filepath] =
      content.slice(0, start) + replacement + content.slice(end);
  }

  // return fileCache;

  for (const [filepath, content] of Object.entries(fileCache)) {
    try {
      fs.writeFileSync(filepath, content, "utf8");
      console.log(`Updated translations in: ${filepath}`);
    } catch (error) {
      console.error(`Error writing to ${filepath}:`, error);
    }
  }
}

async function transformFilesToTranslations(files) {
  let res = [];

  for (const file of files) {
    const translations = extractStringsFromJSX(`./${file.fileLocation}`);
    res.push({ ...file, translations });
  }

  // for (const item of res) {
  //   console.log("TRANSFORM");
  //   await applyTranslations(item.translations);
  // }

  return res;
}

async function generateTranslations(filesWithTranslations) {
  let res = {};
  for (const item of filesWithTranslations) {
    // console.log("TRANSFORM", item);
    const translations = item.translations;

    for (const [componentName, componentStrings] of Object.entries(
      translations
    )) {
      for (const [stringKey, stringData] of Object.entries(componentStrings)) {
        const { filepath, location, text } = stringData;
        const translationKey = `${componentName}.${stringKey}`;

        res = {
          ...res,
          [item?.translationFileName]: {
            ...res?.[item?.translationFileName],
            [stringKey]: text,
          },
        };

        // console.log("COMPONENT NAME", componentName);
      }
    }
  }

  return res;

  // fs.writeFileSync(filepath, content, "utf8");

  // console.log("RES", res);
}

module.exports = {
  generateTranslations,
  extractStringsFromJSX,
  processDirectory,
  applyTranslations,
  transformFilesToTranslations,
};
