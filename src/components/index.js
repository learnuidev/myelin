const { animatedLoadingText } = require("./animated-loading-text");
const { animatedNavbar } = require("./animated-navbar");
const { animatedPill } = require("./animated-pill");
const { copyTextToClipboard } = require("./copy-text-to-clipboard");
const { copyToClipboardButton } = require("./copy-text-to-clipboard-button");
const { leitner, leitnerTs } = require("./leitner");
const { i18next } = require("./i18next");

const { theDock } = require("./the-dock");

const components = {
  "animated-navbar": animatedNavbar,
  "animated-pill": animatedPill,
  "animated-loading-text": animatedLoadingText,
  "the-dock": theDock,
  leitner: leitner,
  "leitner-ts": leitnerTs,
  ...i18next,
  "next-i18n": i18next.i18next,
  "copy-text-to-clipboard": copyTextToClipboard,
  ...copyToClipboardButton,
};

module.exports.components = components;
