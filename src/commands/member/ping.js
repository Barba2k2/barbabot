const { PREFIX } = require("../../config");

module.exports = {
  name: "ping",
  description: "Verify if the bot is on",
  commands: ["ping"],
  usage: `${PREFIX}ping`,
  handle: async ({ sendReply, sendReact }) => {
    await sendReact("🏓");
    await sendReply("🏓 Pong!");
  },
};
