const { select, log, note } = require("@clack/prompts");
const { loadConfig } = require("../translate/utils/load-config");
const crypto = require("crypto");
const {
  addItem,
} = require("../add-cloud-provider/aws/utils/dynamodb/add-item");
const {
  projectsTableName,
} = require("../../../storage/dynamodb/project-table");
const { updateConfig } = require("../translate/utils/update-config");
const {
  checkIfDynamoDBTableExists,
} = require("../add-cloud-provider/aws/utils/dynamodb/check-if-dynamo-table-exists");

const addProject = async () => {
  const config = await loadConfig();

  const table = await checkIfDynamoDBTableExists(projectsTableName);

  if (!table) {
    throw new Error(`${projectsTableName} doesnt exist`);
  }

  let confirm;

  if (config.projectId) {
    confirm = await select({
      message:
        "Project already exists, are you sure you want to continue. Continuing will overwrite the old project!",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    });
  }

  if (confirm === "no") {
    note("Goodbye", "👋");
    return;
  }

  const { projectId, ...rest } = config;

  const newProjectId = crypto.randomUUID();

  const newProject = {
    id: crypto.randomUUID(),
    ...rest,
    createdAt: Date.now(),
  };

  await addItem({ tableName: projectsTableName, item: newProject });

  await updateConfig({
    projectId: newProjectId,
  });

  log.info("Creating new project");

  return newProjectId;
};

module.exports = {
  addProject,
};
