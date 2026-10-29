module.exports = {
  name: "frombinary",
  category: "converter",
  description: "Convert binary back to text",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .frombinary <binary>");
    try {
      const text = args.join("").split(" ").filter(Boolean).map((b) => String.fromCharCode(parseInt(b, 2))).join("");
      await reply(text || "Could not decode.");
    } catch {
      await reply("Invalid binary input.");
    }
  }
};
