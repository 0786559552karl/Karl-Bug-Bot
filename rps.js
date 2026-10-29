module.exports = {
  name: "rps",
  category: "games",
  description: "Play rock-paper-scissors",
  run: async ({ reply, args }) => {
    const choices = ["rock", "paper", "scissors"];
    const user = (args[0] || "").toLowerCase();
    if (!choices.includes(user)) return reply("Usage: .rps <rock|paper|scissors>");
    const bot = choices[Math.floor(Math.random() * 3)];
    let result;
    if (user === bot) result = "Draw!";
    else if ((user === "rock" && bot === "scissors") || (user === "paper" && bot === "rock") || (user === "scissors" && bot === "paper")) result = "You win!";
    else result = "I win!";
    await reply(`You: ${user}\nMe: ${bot}\n${result}`);
  }
};
