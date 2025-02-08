const { log, spinner } = require("@clack/prompts");

const {
  checkIfDynamoDBTableExists,
} = require("./check-if-dynamo-table-exists");
const { createAndWaitForTable } = require("./create-and-wait-for-table");

const createTableIfDoesntExist = async ({ tableName, tableOptions }) => {
  const s = spinner();

  log.info(`Checking if ${tableName} table exists`);
  const table = await checkIfDynamoDBTableExists(tableName);

  if (!table) {
    log.warn(`${tableName} doesnt exist`);
    s.start(`Creating new table [${tableName}]. Please wait`);

    await createAndWaitForTable(tableName, tableOptions);

    s.stop(`${tableName} table created successfully!`);
  } else {
    log.success(`${tableName} table already exists`);
  }
};

//
module.exports = {
  createTableIfDoesntExist,
};
