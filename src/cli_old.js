#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();

console.log("process.argv", process.argv);

program
  .version("1.0.0")
  .description("A simple CLI tool example")
  .option("-g, --greet", "Say hello to the CLI world")
  .parse(process.argv);

// console.log("program", program);

if (program.greet) {
  console.log("Hello, CLI!");
}

// async function main() {
//   program
//     .version("1.0.0")
//     .description("A simple CLI tool example")
//     .option("-g, --greet", "Say hello to the CLI world")
//     .parse(process.argv);

//   if (program.greet) {
//     console.log("Hello, CLI!");
//   }
// }

// main();
