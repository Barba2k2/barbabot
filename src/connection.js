const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const path = require("path");
const pino = require("pino");
const { question, onlyNumbers } = require("./utils");

exports.connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    printQRIfNecessaryListener: false,
    version,
    logger: pino({ level: "error" }),
    auth: state,
    browser: ["Edge (Windows)", "", ""],
    markOnlineOnConnect: true,
  });

  if (!socket.authState.creds.registred) {
    const phoneNumber = await question("Informe seu numero de telefone: ");

    if (!phoneNumber) {
      throw new Error("Numero de telefone inválido");
    }

    const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

    console.log(`Pairing code: ${code}`);
  }

  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        this.connect();
      }
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
};
