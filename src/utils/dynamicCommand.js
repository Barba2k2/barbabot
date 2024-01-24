const { verifyPrefix, hasTypeOrCommand } = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermission");
const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");
const { findCommandImport } = require(".");

exports.dynamicCommand = async (paramsHandler) => {
  const { commandName, prefix, sendWarningReply, sendErrorReply } =
    paramsHandler;

  const { type, command } = findCommandImport(commandName);

  if (!verifyPrefix(prefix) || hasTypeOrCommand({ type, command })) return;

  if (!(await checkPermission({ type, ...paramsHandler }))) {
    return sendErrorReply("You dont have permission to use this command!");
  }

  try {
    await command.handle({ ...paramsHandler, type });
  } catch (err) {
    if (err instanceof InvalidParameterError) {
      await sendWarningReply(`Invalid Parameters! ${err.message}`);
    } else if (err instanceof WarningError) {
      await sendWarningReply(`Warning: ${err.message}`);
    } else if (err instanceof DangerError) {
      await sendErrorReply(`Warning: ${err.message}`);
    } else {
      console.log(`Error: ${err}`);
      await sendErrorReply(`An error ocurred on executing the command: ${command.name}! The developer is notified!!
      
      📄 *Error details:* ${err.message}`);
    }
  }
};
