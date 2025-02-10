const { log, spinner, note } = require("@clack/prompts");
const { extractFiles } = require("./pipeline/extract-files");
const { loadConfig } = require("../translate/utils/load-config");
const {
  transformFilesToTranslations,
  generateTranslations,
} = require("./pipeline/transform-files-to-translations");
const { writeJsonFile } = require("../translate/utils/write-json-file");

const eat = async (location) => {
  const s = spinner();
  const config = await loadConfig();

  const entry = location || config.locale.sourceEntry;

  try {
    // Start analyzing spinner
    s.start("Analyzing code...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const files = await extractFiles({
      directoryPath: `./${entry}`,
    });
    // console.log("FILES", files);
    log.success(`Analysis complete...`);

    // Update to generating translation keys
    s.message("Extracting translation keys...");

    const filesWithTranslations = await transformFilesToTranslations(files);

    // console.log(JSON.stringify(filesWithTranslations, null, 4));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    log.success(`Extraction complete...`);

    // console.log("FILES", files);
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    const translations = await generateTranslations(filesWithTranslations);

    const writeLocation = `./${config.locale.location}/${config.locale.sourceLanguage}/frontend.json`;
    await writeJsonFile(
      `./${config.locale.location}/${config.locale.sourceLanguage}/frontend.json`,
      translations
    );

    s.message("Adding translation keys under /locales/*.json...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    s.message("Updating source code...");
    await new Promise((resolve) => setTimeout(resolve, 2400));

    s.message("Validating source code...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    s.stop();

    console.log(" ");

    const totalFiles = Object.values(translations).flat();

    const totalExtractLength = totalFiles
      ?.map((item) => Object.values(item))
      ?.flat()?.length;

    log.success(
      `Extracted ${totalExtractLength} hardcoded strings with translatable keys from ${totalFiles?.length} files and saved in ${writeLocation}`
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(" ");
    note("Run npx myelino@latest translate to start translation", "Next steps");
  } catch (error) {
    s.stop("Transform failed");
    throw error;
  }
};

module.exports = {
  eat,
};
