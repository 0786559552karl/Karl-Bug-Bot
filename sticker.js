const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "sticker",
  aliases: ["s"],
  category: "sticker",
  description: "Convert a replied image/video into a sticker",
  run: async ({ sock, msg, from, reply, quotedMsg }) => {
    const target = quotedMsg || msg;
    const hasMedia = target.message?.imageMessage || target.message?.videoMessage;
    if (!hasMedia) return reply("Reply to an image or short video with .sticker");

    const buffer = await downloadMediaMessage(
      { message: target.message, key: target.key },
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );

    await sock.sendMessage(from, { sticker: buffer });
  }
};
