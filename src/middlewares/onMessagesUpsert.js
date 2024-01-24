const { loadCommomFunctions } = require("../utils/loadCommomFunctions");

exports.onMessageUpsert = async ({ socket, messages }) => {
  if (!messages.length) return;
  const webMessage = messages[0];
  const commomFunctions = loadCommomFunctions({ sockets, webMessage });

  await dynamicCommand(commomFunctions);
};
