#!/usr/bin/env node

// const figlet = require("figlet");
const { Command } = require("commander"); // add this line
// const fs = require("fs");
// const path = require("path");

const { listDirectoryNames } = require("./actions/list-directory-names");

//add the following line
const program = new Command();

program
  .version("1.0.1")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory names")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;

  listDirectoryNames().then((names) => {
    console.log(names);
  });
}

if (options.gc) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;

  getComponent({
    name: "no-lesson-view.tsx",
    directoryPath: "nmm",
  }).then((names) => {
    console.log(names);
  });
}
