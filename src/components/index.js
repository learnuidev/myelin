const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");
const { theDock } = require("./the-dock");

const components = {
  "animated-navbar": animatedNavbar,
  "animated-pill": animatedPill,
  "the-dock": theDock,
};

module.exports.components = components;
