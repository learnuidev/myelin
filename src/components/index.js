const { animatedLoadingText } = require("./animated-loading-text");
const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");
const { leitner, leitnerTs } = require("./leitner");
const { theDock } = require("./the-dock");

const components = {
  "animated-navbar": animatedNavbar,
  "animated-pill": animatedPill,
  "animated-loading-text": animatedLoadingText,
  "the-dock": theDock,
  leitner: leitner,
  "leitner-ts": leitnerTs,
};

module.exports.components = components;
