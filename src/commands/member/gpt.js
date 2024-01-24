const { PREFIX } = require("../../config");
const { gpt } = require("../../services/gpt");

module.exports = {
  name: "gpt",
  description: "IA Commands",
  commands: ["gpt", "ia"],
  usage: `${PREFIX}gpt com qunatos paus se faz com uma canoa?`,
  handle: async ({ sendSuccessReply, sendErrorReply, sendWaitReply, args }) => {
    const text = args[0];

    if (!text) {
      await sendErrorReply("Do you need to send an text!");
      return;
    }

    await sendWaitReply();

    const responseText = await gpt(text);

    await sendSuccessReply(responseText);
  },
};
