module.exports = {
  name: "guess",
  category: "games",
  description: "Guess a number between 1-10",
  run: async ({ reply, args }) => {
    const guess = parseInt(args[0]);
    if (!guess || guess < 1 || guess > 10) return reply("Usage: .guess <number 1-10>");
    const answer = Math.floor(Math.random() * 10) + 1;
    await reply(guess === answer ? `Correct! The number was ${answer} 🎉` : `Wrong! The number was ${answer}.`);
  }
};
