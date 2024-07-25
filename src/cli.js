#!/usr/bin/env node
const { program } = require("commander");

console.log("Hello, CLI world!");

async function main() {
  program
    .version("1.0.0")
    .description("A simple CLI tool example")
    .option("-g, --greet", "Say hello to the CLI world")
    .parse(process.argv);

  if (program.greet) {
    console.log("Hello, CLI world!");
  }
}

main();
