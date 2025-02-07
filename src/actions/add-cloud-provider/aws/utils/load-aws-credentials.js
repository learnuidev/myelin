const fs = require("fs");
const path = require("path");
const os = require("os");

function loadAWSCredentials() {
  const homeDir = os.homedir();
  const credentialsPath = path.join(homeDir, ".aws", "credentials");
  const configPath = path.join(homeDir, ".aws", "config");

  function parseIniFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);
    const profiles = {};
    let currentProfile = null;

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("[") && line.endsWith("]")) {
        currentProfile = line.slice(1, -1);
        profiles[currentProfile] = {};
      } else if (currentProfile && line.includes("=")) {
        const [key, value] = line.split("=").map((part) => part.trim());
        profiles[currentProfile][key] = value;
      }
    });

    return profiles;
  }

  try {
    const credentials = parseIniFile(credentialsPath);
    const config = parseIniFile(configPath);

    // Merge credentials and config
    const profiles = { ...credentials, ...config };

    return profiles;
  } catch (error) {
    console.error("Error loading AWS credentials:", error.message);
    return null;
  }
}

module.exports = {
  loadAWSCredentials,
};
