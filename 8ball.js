const answers = ["Yes.", "No.", "Maybe.", "Ask again later.", "Definitely!", "Unlikely.", "Without a doubt.", "I wouldn't count on it."];
module.exports = {
  name: "8ball",
  category: "fun",
  description: "Ask the magic 8-ball a question",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .8ball <question>");
    await reply(answers[Math.floor(Math.random() * answers.length)]);
  }
};
