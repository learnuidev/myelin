const isLocalSync = ({ config }) => {
  return config.sync.type === "local";
};

module.exports = {
  isLocalSync,
};
