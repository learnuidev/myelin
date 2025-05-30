const { animatedLoadingText } = require("./animated-loading-text");
const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");

const { copyToClipboardButton } = require("./copy-to-clipboard-button");
const { leitner, leitnerTs } = require("./leitner");
const { i18next } = require("./i18next");

const { theDock } = require("./the-dock");
const { copyToClipboard } = require("./copy-to-clipboard");
const { blog } = require("./blog/blog");
const { myelinUI } = require("./myelin-ui");

const components = {
  "animated-navbar": animatedNavbar,
  "animated-pill": animatedPill,
  "animated-loading-text": animatedLoadingText,
  "the-dock": theDock,
  leitner: leitner,
  "leitner-ts": leitnerTs,
  ...i18next,
  "next-i18n": i18next.i18next,
  "copy-to-clipboard": copyToClipboard,
  ...copyToClipboardButton,
  ...blog,
  "myelin-ui": myelinUI,
};

module.exports.components = components;
