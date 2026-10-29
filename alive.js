const config = require("../../config");
module.exports = {
  name: "alive",
  category: "general",
  description: "Shows bot uptime and status",
  run: async ({ reply }) => {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    await reply(`${config.botName} is online.\nUptime: ${h}h ${m}m ${s}s`);
  }
};
