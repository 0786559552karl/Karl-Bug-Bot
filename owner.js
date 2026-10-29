const config = require("../../config");
module.exports = {
  name: "owner",
  category: "general",
  description: "Get the bot owner's contact",
  run: async ({ reply }) => {
    await reply(`Bot created by *${config.ownerName}*.\nContact: wa.me/${config.feedbackNumber.replace(/[^0-9]/g, "")}`);
  }
};
