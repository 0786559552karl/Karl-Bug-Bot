module.exports = {
  name: "frombase64",
  category: "converter",
  description: "Decode base64 to text",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .frombase64 <base64>");
    try {
      await reply(Buffer.from(args.join(""), "base64").toString("utf8"));
    } catch {
      await reply("Invalid base64 input.");
    }
  }
};
