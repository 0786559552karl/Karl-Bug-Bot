const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "toimage",
  aliases: ["toimg"],
  category: "sticker",
  description: "Convert a replied sticker back into an image",
  run: async ({ sock, from, reply, quotedMsg }) => {
    if (!quotedMsg?.message?.stickerMessage) return reply("Reply to a sticker with .toimage");
    const buffer = await downloadMediaMessage(
      { message: quotedMsg.message, key: quotedMsg.key },
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );
    await sock.sendMessage(from, { image: buffer });
  }
};
