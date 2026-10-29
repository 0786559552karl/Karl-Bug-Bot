const quotes = [
  "The best way to predict the future is to create it.",
  "Simplicity is the ultimate sophistication.",
  "What you do today can improve all your tomorrows.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do."
];
module.exports = {
  name: "quote",
  category: "fun",
  description: "Get an inspirational quote",
  run: async ({ reply }) => {
    await reply(quotes[Math.floor(Math.random() * quotes.length)]);
  }
};
