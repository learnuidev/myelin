#!/usr/bin/env node

// const figlet = require("figlet");
const { Command } = require("commander"); // add this line
// const fs = require("fs");
// const path = require("path");

const { listDirectoryNames } = require("./actions/list-directory-names");

//add the following line
const program = new Command();

async function listDirContents(filepath) {
  try {
    const files = await fs.promises.readdir(filepath);
    const detailedFilesPromises = files.map(async (file) => {
      let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
      const { size, birthtime } = fileDetails;
      return { filename: file, "size(KB)": size, created_at: birthtime };
    });
    // add the following
    const detailedFiles = await Promise.all(detailedFilesPromises);
    console.table(detailedFiles);
  } catch (error) {
    console.error("Error occurred while reading the directory!", error);
  }
}

// create the following function
function createDir(filepath) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
    console.log("The directory has been created successfully");
  }
}

// create the following function
function createFile(filepath) {
  fs.openSync(filepath, "w");
  console.log("An empty file has been created");
}

// console.log(figlet.textSync("Welcome to Myelin"));

program
  .version("1.0.1")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;
  console.log("TODO");

  // listDirectoryNames();
}
if (options.mkdir) {
  createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}
