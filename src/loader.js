const { TIME_OUT_MILLISECONDS_BY_EVENT } = require("./config");
const { onMessageUpsert } = require("./middlewares/onMessagesUpsert");

exports.load = (socket) => {
  socket.ev.on("messages.upsert", ({ messages }) => {
    setTimeout(() => {
      onMessagesUpsert({ socket, messages });
    }, TIME_OUT_MILLISECONDS_BY_EVENT);
  });
};
