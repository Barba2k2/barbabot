const { extractDataFromMessage, baileysIs, download } = require(".");
const { BOT_EMOJI } = require("../config");
const fs = require("fs");
const { waitMessage } = require("../utils/messages");

exports.loadCommomFunctions = ({ socket, webMessage }) => {
  const { remoteJid, prefix, commandName, args, userJid, isReply, replyJid } =
    extractDataFromMessage(webMessage);

  const isImage = baileysIs(webMessage, "image");
  const isVideo = baileysIs(webMessage, "video");
  const isSticker = baileysIs(webMessage, "stricker");

  const downloadImage = async (webMessage, fileName) => {
    return await download(webMessage, fileName, "image", "png");
  };

  const downloadSticker = async (webMessage, fileName) => {
    return await download(webMessage, fileName, "sticker", "webp");
  };

  const downloadVideo = async (webMessage, fileName) => {
    return await download(webMessage, fileName, "video", "mp4");
  };

  const sendText = async (text) => {
    return await socket.sendMessage(remoteJid, {
      text: `${BOT_EMOJI} ${text}`,
    });
  };

  const sendReply = async (reply) => {
    return await socket.sendMessage(
      remoteJid,
      { text: `${BOT_EMOJI} ${text}` },
      { quoted: webMessage }
    );
  };

  const sendReact = async (emoji) => {
    return await socket.sendMessage(remoteJid, {
      react: {
        text: emoji,
        key: webMessage.key,
      },
    });
  };

  const sendSuccessReact = async () => {
    return await sendReact("✅");
  };

  const sendWaitReact = async () => {
    return await sendReact("⏳");
  };

  const sendWarningReact = async () => {
    return await sendReact("⚠️");
  };

  const sendErrorReact = async () => {
    return await sendReact("❌");
  };

  const sendSuccessReply = async (text) => {
    await sendSuccessReact();
    return await sendReply(`✅ ${text}`);
  };

  const sendWaitReply = async (text) => {
    await sendWaitReact();
    return await sendReply(`⏳ ${text || waitMessage}`);
  };

  const sendWarningReply = async (text) => {
    await sendWarningReact();
    return await sendReply(`⚠️ ${text}`);
  };

  const sendErrorReply = async (text) => {
    await sendErrorReact();
    return await sendReply(`❌ ${text}`);
  };

  const sendStickerFromFile = async (file) => {
    await socket.sendMessage(remoteJid, {
      sticker: fs.readFileSync(file),
    });
  };

  const sendImageFromFile = async (file) => {
    await socket.sendMessage(remoteJid, {
      image: fs.readFileSync(file),
    });
  };

  return {
    socket,
    remoteJid,
    userJid,
    prefix,
    commandName,
    args,
    isReply,
    isImage,
    isVideo,
    isSticker,
    replyJid,
    webMessage,
    sendText,
    sendReply,
    sendStickerFromFile,
    sendImageFromFile,
    sendReact,
    sendSuccessReact,
    sendWaitReact,
    sendWarningReact,
    sendErrorReact,
    sendErrorReply,
    sendSuccessReply,
    sendWaitReply,
    sendWarningReply,
    sendErrorReact,
    downloadImage,
    downloadSticker,
    downloadVideo,
  };
};
