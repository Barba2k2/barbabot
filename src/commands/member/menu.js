const { PREFIX } = require("../../config");
const { menuMessage } = require("../../utils/messages");

module.exports = {
  name: "menu",
  description: "Command menu",
  commands: ["menu", "help"],
  usage: `${PREFIX}menu`,
  handle: async ({ sendReply }) => {
    await sendReply(`\n\n${menuMessage}`);
  },
};
