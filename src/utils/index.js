const readline = require("readline");

exports.question = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(message, resolve));
};

exports.onlyNumbers = (text) => text.replace(/[^0-9]/g, "");
