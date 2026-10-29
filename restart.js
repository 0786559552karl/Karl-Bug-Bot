module.exports = {
  name: "restart",
  category: "owner",
  description: "Restart the bot process (owner only)",
  ownerOnly: true,
  run: async ({ reply }) => {
    await reply("Restarting...");
    process.exit(0);
  }
};
