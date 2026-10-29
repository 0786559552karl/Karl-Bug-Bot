module.exports = {
  name: "upper",
  category: "converter",
  description: "Convert text to uppercase",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .upper <text>");
    await reply(args.join(" ").toUpperCase());
  }
};
