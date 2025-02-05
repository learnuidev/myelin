const {
  getSourceFolderPath,
} = require("../../../../translate/utils/get-source-folder-path");

const {
  loadJsonFilesFromFolder,
} = require("../../../../translate/utils/load-json-files-from-folder");

const emptyLine = `\n`;

const importi18nOption = `import { i18nOptions } from "@/libs/i18n-next/i18n-config";${emptyLine}`;

const declareModuleStart = `declare module "i18next" {${emptyLine}`;

const CustomTypeOptionsStart = `  interface CustomTypeOptions {${emptyLine}`;

const defaultNSRaw = `    defaultNS: typeof i18nOptions.defaultNS;${emptyLine}`;
const resourcesStart = `    resources: {${emptyLine}`;
const customResourcePlaceholder = `      {{resource}}: typeof {{resource}};${emptyLine}`;
const resourcesEnd = `    };${emptyLine}`;
const CustomTypeOptionsEnd = `  }${emptyLine}`;

const declareModuleEnd = `}${emptyLine}`;

async function generatei18nModule({ config }) {
  const sourceFolderPath = getSourceFolderPath({ config });
  const sourceTranslations = await loadJsonFilesFromFolder(sourceFolderPath);

  const sourceFileWithAt = `@${sourceFolderPath?.split(".")?.[1]}`;

  const importsRaw = sourceTranslations?.map((translation) => {
    return `import ${translation.baseFileName} from "${sourceFileWithAt}/${translation.fileName}";${emptyLine}`;
  });

  const resourceItems = sourceTranslations?.map((translation) => {
    return customResourcePlaceholder.replaceAll(
      "{{resource}}",
      translation.baseFileName
    );
  });

  const code = [
    importi18nOption,
    emptyLine,
    ...importsRaw,
    emptyLine,
    declareModuleStart,
    CustomTypeOptionsStart,
    defaultNSRaw,
    resourcesStart,
    ...resourceItems,
    resourcesEnd,
    CustomTypeOptionsEnd,
    declareModuleEnd,
    emptyLine,
  ].join("");

  return code;
}

module.exports = {
  generatei18nModule,
};
