module.exports = {
  name: "reverse",
  category: "converter",
  description: "Reverse a string",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .reverse <text>");
    await reply(args.join(" ").split("").reverse().join(""));
  }
};
