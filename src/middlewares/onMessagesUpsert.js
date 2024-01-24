const { loadCommomFunctions } = require("../utils/loadCommomFunctions");
const { dynamicCommand } = require("../utils/dynamicCommand");

exports.onMessageUpsert = async ({ socket, messages }) => {
  if (!messages.length) return;
  const webMessage = messages[0];
  const commomFunctions = loadCommomFunctions({ sockets, webMessage });

  await dynamicCommand(commomFunctions);
};
