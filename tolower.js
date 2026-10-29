module.exports = {
  name: "lower",
  category: "converter",
  description: "Convert text to lowercase",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .lower <text>");
    await reply(args.join(" ").toLowerCase());
  }
};
