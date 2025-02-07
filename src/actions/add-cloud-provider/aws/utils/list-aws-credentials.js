const fs = require("fs").promises;
const path = require("path");

async function listAWSCredentials() {
  try {
    const credentialsPath = path.join(
      process.env.HOME || process.env.USERPROFILE,
      ".aws",
      "credentials"
    );
    const data = await fs.readFile(credentialsPath, "utf-8");

    // Parse the credentials file
    const profileRegex = /\[([^\]]+)\]\s*([\s\S]+?)(?=\[|\z)/g;
    let match;
    const profiles = {};

    while ((match = profileRegex.exec(data)) !== null) {
      const profileName = match[1].trim();
      const profileData = match[2].trim();

      const credentials = {};
      profileData.split("\n").forEach((line) => {
        const [key, value] = line.split("=").map((str) => str.trim());
        if (key && value) {
          credentials[key] = value;
        }
      });

      profiles[profileName] = credentials;
    }

    const credentials = Object.entries(profiles).map((item) => {
      return {
        id: item[0],
        ...item[1],
      };
    });

    if (!credentials?.length) {
      throw new Error("AWS Credentials not found");
    }
    return credentials;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listAWSCredentials,
};
