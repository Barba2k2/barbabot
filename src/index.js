const { connect } = require("./connection");

async function start() {
  const socket = await cannect();

  load(socket);
}

start();
