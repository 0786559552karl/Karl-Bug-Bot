module.exports = {
  name: "tobase64",
  category: "converter",
  description: "Encode text to base64",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .tobase64 <text>");
    await reply(Buffer.from(args.join(" ")).toString("base64"));
  }
};
