const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");

const components = {
  "animated-navbar": {
    id: "animated-navbar",
    code: animatedNavbar,
  },
  "animated-pill": {
    id: "animated-pill",
    code: animatedPill,
  },
};

module.exports.components = components;
