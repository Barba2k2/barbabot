const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const readline = require("readline");
const { PREFIX, TEMP_DIR, COMMANDS_DIR: COMMANDS_DIR } = require("../config");
const path = require("path");
const { whiteFile: writeFile } = require("fs/promises");
const fs = require("fs");

exports.question = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(message, resolve));
};

exports.onlyNumbers = (text) => text.replace(/[^0-9]/g, "");

exports.extractDataFromMessage = (webMessage) => {
  // Text Message
  const textMessage = webMessage.message?.conversation;

  // Extended Text Message
  const extendedTextMessage = webMessage.message?.extendedTextMessage;

  // Extended Text Message Text
  const extendedTextMessageText = extendedTextMessage?.text;

  // Image Text Message
  const imageTextMessage = webMessage.message?.imageMessage?.caption;

  // Video Text Message
  const videoTextMessage = webMessage.message?.videoMessage?.caption;

  // Full Message
  const fullMessage =
    textMessage || extendedTextMessage || imageTextMessage || videoTextMessage;

  if (!fullMessage) {
    return {
      remoteJid: null, // Group ID
      userJid: null, // User ID
      prefix: null,
      commandName: null,
      isReply: null,
      replyJid: null,
      args: [],
    };
  }

  const isReply =
    !!extendedTextMessage && extendedTextMessage.contextInfo?.quotedMessage;

  const replyJid =
    !!extendedTextMessage && extendedTextMessage.contextInfo?.participant
      ? extendedTextMessage.contextInfo.participant
      : null;

  const userJid = webMessage?.key?.participant?.replace(
    /:[0-9][0-9]|:[0-9]/g,
    ""
  );

  const [comand, ...args] = fullMessage.split(" ");
  const prefix = command.charAt(0);

  const commandWithoutPrefix = comand.replace(new RegExp(`^[${PREFIX}]+`));

  return {
    remoteJid: webMessage?.key?.remoteJid,
    prefix,
    userJid,
    replyJid,
    isReply,
    commandName: this.formatCommand(commandWithoutPrefix),
    args: this.splitByCharacters(args.join(" "), ["\\", "|", "/"]),
  };
};

exports.splitByCharacters = (str, characters) => {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${character.join("")}]`);

  return str
    .split(regex)
    .map((str) => str.trim())
    .filter(Boolean);
};

exports.onlyLettersAndNumbers = (text) => {
  return text.replace(/[^a-zA-Z0-9]/g, "");
};

exports.formatCommand = (text) => {
  return this.onlyLettersAndNumbers(
    this.removeAccentsAndSpecialCharacters(text.toLocaleLowerCase().trim())
  );
};

exports.removeAccentsAndSpecialCharacters = (text) => {
  if (!text) return "";

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

exports.baileysIs = (webMessage, context) => {
  return !!this.getContent(webMessage, context);
};

exports.getContent = (webMessage, context) => {
  return (
    webMessage.message?.[`${context}Message`] ||
    webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
};

exports.download = async (webMessage, fileName, context, extension) => {
  const content = this.getContent(webMessage, context);

  if (!content) {
    return null;
  }

  const stream = await downloadContentFromMessage(content, context);

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const filePath = path.resolve(TEMP_DIR, `${fileName}.${extension}`);

  await writeFile(filePath, buffer);

  return filePath;
};

exports.findCommandImport = (commandName) => {
  const command = this.readCommandImports();

  let typeReturn = "";
  let targetCommandReturn = null;

  for (const [type, commands] of Object.entries(command)) {
    if (!commands.length) {
      continue;
    }

    const targetCommand = commands.find((cmd) =>
      cmd.commands.map((cmd) => this.formatCommand(cmd)).includes(commandName)
    );

    if (targetCommand) {
      typeReturn = type;
      targetCommandReturn = targetCommand;
      break;
    }
  }

  return {
    type: typeReturn,
    command: targetCommandReturn,
  };
};

exports.readCommandImports = () => {
  const subdirectors = fs
    .readdirSync(COMMANDS_DIR, { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name);

  const commandImports = {};

  for (const subdir of subdirectors) {
    const subdirectoryPath = path.join(COMMANDS_DIR, subdir);
    const files = fs
      .readdirSync(subdirectoryPath)
      .filter(
        (file) =>
          !file.startsWith("_") &&
          (file.endsWith(".js") || file.endsWith(".ts"))
      );

    commandImports[subdir] = files;
  }

  return commandImports;
};
