module.exports = {
  name: "ping",
  category: "general",
  description: "Check if the bot is alive and measure response speed",
  run: async ({ reply }) => {
    const start = Date.now();
    const sent = await reply("Pinging...");
    const ms = Date.now() - start;
    await reply(`Pong! 🏓 ${ms}ms`);
  }
};
