async function start() {
  const socket = await cannect();

  load(socket);
}

start();
