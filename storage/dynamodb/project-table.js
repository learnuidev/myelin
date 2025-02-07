const projectsTableOptions = {
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  BillingMode: "PAY_PER_REQUEST",
};

const projectsTableName = "MyelinProjectsTable";

module.exports = {
  projectsTableName,
  projectsTableOptions,
};
