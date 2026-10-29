const jokes = [
  "I told my computer I needed a break, and it said no problem — it froze immediately.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks: can I join you?",
  "There are 10 types of people: those who understand binary and those who don't.",
  "I would tell a UDP joke, but you might not get it."
];
module.exports = {
  name: "joke",
  category: "fun",
  description: "Get a random joke",
  run: async ({ reply }) => {
    await reply(jokes[Math.floor(Math.random() * jokes.length)]);
  }
};
