module.exports = {
  name: "dice",
  category: "fun",
  description: "Roll a dice",
  run: async ({ reply }) => {
    await reply(`🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}`);
  }
};
