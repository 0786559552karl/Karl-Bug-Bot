const questions = [
  { q: "What is the capital of Japan?", a: "tokyo" },
  { q: "How many continents are there?", a: "7" },
  { q: "What planet is known as the Red Planet?", a: "mars" },
  { q: "What is the largest ocean on Earth?", a: "pacific" }
];
module.exports = {
  name: "trivia",
  category: "games",
  description: "Get a trivia question (answer with .answer)",
  run: async ({ reply, session }) => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    session.trivia = q.a;
    await reply(`❓ ${q.q}\nReply using: .answer <your answer>`);
  }
};
