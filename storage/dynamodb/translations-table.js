const translationsTableName = "MyelinTranslationsTable";

const translationsTableOptions = {
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" },
    { AttributeName: "projectId", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
    { AttributeName: "projectId", AttributeType: "S" },
  ],
  BillingMode: "PAY_PER_REQUEST",
  GlobalSecondaryIndexes: [
    {
      IndexName: "byProjectId",
      KeySchema: [{ AttributeName: "projectId", KeyType: "HASH" }],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
};

module.exports = {
  translationsTableName,
  translationsTableOptions,
};
