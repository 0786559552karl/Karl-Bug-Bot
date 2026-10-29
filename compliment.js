const lines = [
  "You light up every room you walk into.",
  "Your hard work doesn't go unnoticed.",
  "You have an incredible ability to make people feel valued.",
  "You're more capable than you give yourself credit for."
];
module.exports = {
  name: "compliment",
  category: "fun",
  description: "Get a random compliment",
  run: async ({ reply }) => {
    await reply(lines[Math.floor(Math.random() * lines.length)]);
  }
};
