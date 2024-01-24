const path = require("path");

exports.PREFIX = "/";
exports.BOT_EMOJI = "🤖";
exports.BOT_NAME = "Barba Bot";
exports.BOT_NUMBER = "";

exports.COMANDS_DIR = path.resolve(__dirname, "commands");
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

exports.TIME_OUT_MILLISECONDS_BY_EVENT = 500;

exports.OPEN_AI_KEY = "";