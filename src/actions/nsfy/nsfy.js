const { printTable } = require("console-table-printer");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadSourceTranslations,
} = require("../translate/utils/load-source-translations");

const picocolors = require("picocolors");
const { extractFiles } = require("../eat/pipeline/extract-files");
const { note, log } = require("@clack/prompts");
const { writeFile } = require("../translate/utils/write-file");

const nsfy = async (subCommands) => {
  const config = await loadConfig();

  const sourceTranslations = await loadSourceTranslations({ config });

  const entries = config?.locale?.sourceEntries;

  const files = (
    await Promise.all(
      entries.map(async (entry) => {
        return await extractFiles({
          directoryPath: `./${entry}`,
        });
      })
    )
  )?.flat();

  const formattedTranslations = sourceTranslations.map((item) => {
    const nameSpace = item?.baseFileName;

    const unusedKeys = Object.keys(item?.sourceTranslation || {})?.filter(
      async (key) => {
        const notUsedInFile = files
          ?.filter((file) => {
            const searchSingleStr = `t('${key}')`;
            const searchDoubleStr = `t("${key}")`;
            const codeContainsKey =
              file?.code?.includes(searchDoubleStr) ||
              file?.code?.includes(searchSingleStr);

            if (codeContainsKey) {
              return true;
            }

            return false;
            // return file?.code?.includes(`${key}`);
          })
          .map((file) => {
            const searchSingleStr = `t('${key}')`;

            const searchDoubleStr = `t("${key}")`;

            const isSingleString = file?.code?.includes(searchSingleStr);
            const quotes = isSingleString ? `'` : `"`;
            const searchStr = isSingleString
              ? searchSingleStr
              : searchDoubleStr;

            return {
              ...file,
              code: file.code.replace(
                searchStr,
                `t(${quotes}${nameSpace}:${key}${quotes})`
              ),
            };
          });
        if (notUsedInFile?.length !== 0) {
          for (const fileItem of notUsedInFile) {
            await writeFile(fileItem?.fileLocation, fileItem?.code);
          }
          log.success(`Namespaced ${notUsedInFile?.length} files`);
        }

        return notUsedInFile?.length === 0;
      }
    );

    return unusedKeys;
  });
};

module.exports = {
  nsfy,
};
