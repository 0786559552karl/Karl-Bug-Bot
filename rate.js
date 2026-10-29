module.exports = {
  name: "rate",
  category: "fun",
  description: "Rate anything out of 100",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .rate <something>");
    const score = Math.floor(Math.random() * 101);
    await reply(`I'd rate "${args.join(" ")}" ${score}/100`);
  }
};
