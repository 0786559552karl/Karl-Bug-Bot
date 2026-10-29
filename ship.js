module.exports = {
  name: "ship",
  category: "fun",
  description: "Ship two names together",
  run: async ({ reply, args }) => {
    if (args.length < 2) return reply("Usage: .ship <name1> <name2>");
    const score = Math.floor(Math.random() * 101);
    await reply(`${args[0]} + ${args[1]} = ${score}% compatible 💕`);
  }
};
