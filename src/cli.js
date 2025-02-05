#!/usr/bin/env node

// const figlet = require("figlet");
const { Command } = require("commander"); // add this line
// const fs = require("fs");
// const path = require("path");

const { listDirectoryNames } = require("./actions/list-directory-names");
const { getComponent } = require("./actions/get-component");
const { addComponent } = require("./actions/add-component");
const { translate } = require("./actions/translate/translate");
const {
  updateComponent,
} = require("./actions/update-component/update-component");
const {
  upsertComponent,
} = require("./actions/upsert-component/upsert-component");

//add the following line
const program = new Command();

program
  .version("1.0.1")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory names")
  .option("-c, --c <value> <value-2>", "Get component")
  .option("-a, --add <name>", "Add a component")
  .option("-u, --update <name>", "Update a component")
  .option("-up, --upsert <name>", "Upsert a component")
  .option("-t, --touch <value>", "Create a file")
  .option("-tr, --translate", "Translate")
  .parse(process.argv);

const options = program.opts();

if (options.translate) {
  translate()
    .then(() => {
      console.log("DONE!!");
    })
    .catch((err) => {
      throw new Error(err);
    });
}

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;

  listDirectoryNames().then((names) => {
    console.log(names);
  });
}

if (options.c) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;
  const [a, b, c, directoryPath, name] = process.argv;

  getComponent({
    name: name || "no-lesson-view.tsx",
    directoryPath: directoryPath || "nmm",
  }).then((names) => {
    console.log(names);
  });
}

if (options.add) {
  addComponent(options.add);
}

if (options.update) {
  updateComponent(options.update);
}
if (options.upsert) {
  upsertComponent(options.upsert);
}
