const { select, log, note, text } = require("@clack/prompts");
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
const { listProjects } = require("../translate/utils/list-projects");

const { formatDistanceToNow } = require("date-fns");
const { syncUp } = require("../sync/sync-up");
const {
  addCloudProvider,
} = require("../add-cloud-provider/add-cloud-provider");

function timeAgo(timestamp) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

const addProject = async () => {
  const config = await loadConfig();

  if (!config.cloud) {
    await addCloudProvider();
  }

  const table = await checkIfDynamoDBTableExists(projectsTableName);

  if (!table) {
    throw new Error(`${projectsTableName} doesnt exist`);
  }

  let confirm;
  let projectId;

  if (!config.projectId) {
    const projects = await listProjects();

    if (projects?.length > 0) {
      log.info(`Checking if remote projects exist...`);
      projectId = await select({
        message:
          "Looks like you have already created projects, would you like to use an existing project?",
        options: projects
          ?.map((item) => {
            return {
              value: item?.id,
              label: `${item?.id} [${item?.name}] - [Created ${timeAgo(item?.createdAt)}]`,
            };
          })
          .concat({
            value: null,
            label: "No thanks, create a new one",
          }),
      });
    }
  }

  if (projectId) {
    await updateConfig({
      projectId: projectId,
    });

    log.success(`Updated the project with the following project: ${projectId}`);
    return;
  }

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

  const { customAiUrl, aiProvider, locale, cloud, storageProvider } = config;

  const name = await text({
    message: "Give your project a name",
    placeholder: "my-awesome-project",
    validate: (value) => {
      if (!value) return "Name cannot be empty";
      return;
    },
  });

  const newProjectId = crypto.randomUUID();

  const newProject = {
    id: newProjectId,
    name: `${name}`,
    customAiUrl,
    aiProvider,
    locale,
    cloud,
    storageProvider,
    createdAt: Date.now(),
  };

  await addItem({ tableName: projectsTableName, item: newProject });

  await updateConfig({
    projectId: newProjectId,
  });

  await syncUp(newProjectId);

  log.info("Creating new project");

  return newProjectId;
};

module.exports = {
  addProject,
};
