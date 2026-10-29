const fs = require("fs");
const path = require("path");
module.exports = {
  name: "setname",
  category: "owner",
  description: "Change the bot's display name (owner only)",
  ownerOnly: true,
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .setname <new name>");
    const configPath = path.join(__dirname, "..", "..", "config.js");
    let content = fs.readFileSync(configPath, "utf8");
    content = content.replace(/botName: ".*?"/, `botName: "${args.join(" ")}"`);
    fs.writeFileSync(configPath, content);
    await reply(`Bot name updated to "${args.join(" ")}". Restart to fully apply.`);
  }
};
