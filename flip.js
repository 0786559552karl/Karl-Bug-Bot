module.exports = {
  name: "flip",
  category: "fun",
  description: "Flip a coin",
  run: async ({ reply }) => {
    await reply(Math.random() < 0.5 ? "Heads" : "Tails");
  }
};
