module.exports = {
  name: "tobinary",
  category: "converter",
  description: "Convert text to binary",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .tobinary <text>");
    const bin = args.join(" ").split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    await reply(bin);
  }
};
