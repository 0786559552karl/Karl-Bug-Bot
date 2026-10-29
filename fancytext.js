const { toFancyFont } = require("../../lib/style");
module.exports = {
  name: "fancy",
  category: "converter",
  description: "Convert text into stylish unicode font",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .fancy <text>");
    await reply(toFancyFont(args.join(" ")));
  }
};
