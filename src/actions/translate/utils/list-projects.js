const {
  projectsTableName,
} = require("../../../../storage/dynamodb/project-table");
const { scan } = require("../../add-cloud-provider/aws/utils/dynamodb/scan");

const listProjects = async () => {
  const projects = await scan(projectsTableName);

  return projects?.sort((a, b) => a?.createdAt - b?.createdAt);
};

module.exports = {
  listProjects,
};
