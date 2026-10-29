const lines = [
  "You bring everyone so much joy... when you leave the room.",
  "I'd explain it to you, but I left my crayons at home.",
  "You're proof that evolution can go in reverse.",
  "I'm jealous of people who don't know you."
];
module.exports = {
  name: "insult",
  category: "fun",
  description: "Get a playful (non-targeted) roast line",
  run: async ({ reply }) => {
    await reply(lines[Math.floor(Math.random() * lines.length)]);
  }
};
