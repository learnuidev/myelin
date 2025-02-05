const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");

const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

const updateComponent = async (name) => {
  console.log("name", name);
};

module.exports.updateComponent = updateComponent;
