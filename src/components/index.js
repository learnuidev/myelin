const { animatedLoadingText } = require("./animated-loading-text");
const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");
const { copyTextToClipboard } = require("./copy-text-to-clipboard");
const { leitner, leitnerTs } = require("./leitner");
const { nextI8n } = require("./next-i18n");
const { theDock } = require("./the-dock");

const components = {
  "animated-navbar": animatedNavbar,
  "animated-pill": animatedPill,
  "animated-loading-text": animatedLoadingText,
  "the-dock": theDock,
  leitner: leitner,
  "leitner-ts": leitnerTs,
  "next-i18n": nextI8n,
  "copy-text-to-clipboard": copyTextToClipboard,
};

module.exports.components = components;
