const config = require("../../config");
module.exports = {
  name: "feedback",
  aliases: ["report", "contact"],
  category: "general",
  description: "Send feedback or report an issue",
  run: async ({ reply, args }) => {
    if (!args.length) {
      await reply(`Please describe your feedback, e.g.\n.feedback the sticker command is slow\n\nOr message directly: wa.me/${config.feedbackNumber.replace(/[^0-9]/g, "")}`);
      return;
    }
    await reply(`Thanks! Your feedback has been noted:\n"${args.join(" ")}"\n\nFor urgent issues, contact wa.me/${config.feedbackNumber.replace(/[^0-9]/g, "")}`);
  }
};
