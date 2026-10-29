const facts = [
  "Honey never spoils — archaeologists have found edible honey in ancient Egyptian tombs.",
  "Octopuses have three hearts.",
  "Bananas are berries, but strawberries aren't.",
  "A day on Venus is longer than a year on Venus."
];
module.exports = {
  name: "fact",
  category: "fun",
  description: "Get a random fun fact",
  run: async ({ reply }) => {
    await reply(facts[Math.floor(Math.random() * facts.length)]);
  }
};
