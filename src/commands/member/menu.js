const { PREFIX } = require("../../config");

module.exports = {
  name: "command",
  description: "Command description",
  commands: ["command1", "command2"],
  usage: `${PREFIX}command`,
  handle: async ({}) => {
    // command code
  },
};
