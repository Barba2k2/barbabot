const { PREFIX, TEMP_DIR } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "to Image",
  description: "I make images from static images",
  commands: ["toImg", "toimg", "img", 'to-img'],
  usage: `${PREFIX}toImage (reply the sticker) ou ${PREFIX}toImage (mention the sticker)`,
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendImageFormFile,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError("Dou you need to send an sticker!");
    }

    const inputPath = await downloadSticker(webMessage, "input");
    const outputPath = path.resolve(TEMP_DIR, "output.png");

    exec(`ffmep - i ${inputPath} ${outputPath}`, async (error) => {
      if (error) {
        console.log(error);
        fs.unlinkSync(inputPath);
        throw new Error(error);
      }

      await sendImageFormFile(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  },
};
