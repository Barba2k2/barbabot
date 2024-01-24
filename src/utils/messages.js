const { BOT_NAME, PREFIX } = require("../config");

exports.waitMessage = "Loading data...";

exports.menuMessage = () => {
  const date = new Date();

  return `╭━━⪩ WELCOME! ⪨━━
▢
▢ • ${BOT_NAME}
▢ • Date: ${date.toLocaleDateString("pt-br")}
▢ • Time: ${date.toLocaleTimeString("pt-br")}
▢ • Prefix: ${PREFIX}
▢
╰━━─「🪐」─━━

╭━━⪩ ADMINS ⪨━━
▢
▢ • ${PREFIX}ban
▢
╰━━─「⭐」─━━

╭━━⪩ MENU ⪨━━
▢
▢ • ${PREFIX}cep
▢ • ${PREFIX}gpt
▢ • ${PREFIX}ping
▢ • ${PREFIX}sticker
▢ • ${PREFIX}to-image
▢
╰━━─「🚀」─━━`;
};
