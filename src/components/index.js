const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");
const { leitner } = require("./leitner");
const { theDock } = require("./the-dock");

const components = {
  "animated-navbar": animatedNavbar,
  "animated-pill": animatedPill,
  "the-dock": theDock,
  leitner: leitner,
};

module.exports.components = components;
