module.exports = {
  name: "math",
  category: "games",
  description: "Get a random math problem",
  run: async ({ reply, session }) => {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
    session.mathAnswer = eval(`${a}${op}${b}`);
    await reply(`What is ${a} ${op} ${b}?\nReply using: .answer <result>`);
  }
};
