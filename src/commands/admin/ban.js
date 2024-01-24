const { PREFIX, BOT_NUMBER } = require("../../config");
const { DangerError, InvalidParameterError } = require("../../errors");
const { onlyNumbers, toUserJid } = require("../../utils");

module.exports = {
  name: "ban",
  description: "I remove one member of group",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @member 
  
  *OR*
  
  ${PREFIX}ban (member reply)`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendSuccessReply,
    userJid,
    sendSuccessReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError("Do you need reply or mention an member");
    }

    const memberToRemoveNumber = onlyNumbers(args[0]);
    const memberToRemoveJid = isReply
      ? replyJid
      : toUserJid(memberToRemoveNumber);

    if (memberToRemoveNumber.length < 7 || memberToRemoveJid.length > 15) {
      throw new InvalidParameterError("Invalid number");
    }

    if (memberToRemoveJid === userJid) {
      throw new DangerError("Do you not remove yourself");
    }

    const botJid = toUserJid(BOT_NUMBER);

    if (memberToRemoveJid === botJid) {
      throw new DangerError("Do you not remove himself");
    }

    await socket.groupParticipantsUpdate(
      remoteJid,
      [memberToRemoveJid],
      "remove"
    );

    await sendSuccessReply("Memeber removed successfully!! ✅");
  },
};
