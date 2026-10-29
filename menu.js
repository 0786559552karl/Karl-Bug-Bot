const config = require("../../config");

module.exports = {
  name: "menu",
  aliases: ["help", "commands"],
  category: "general",
  description: "Show all available commands",
  run: async ({ sock, msg, from, reply, allCommands }) => {
    const byCategory = {};
    for (const cmd of allCommands) {
      const cat = cmd.category || "misc";
      byCategory[cat] = byCategory[cat] || [];
      byCategory[cat].push(cmd.name);
    }

    let body = `Hi, I'm *${config.botName}* 🤖\nCreated by *${config.ownerName}*\n`;
    body += `Prefix: *${config.prefix}*\n\n`;

    for (const [cat, cmds] of Object.entries(byCategory)) {
      body += `*${cat.toUpperCase()}*\n`;
      body += cmds.map((c) => `• ${config.prefix}${c}`).join("\n");
      body += `\n\n`;
    }

    body += `Feedback / support: wa.me/${config.feedbackNumber.replace(/[^0-9]/g, "")}`;

    await reply(body);
  }
};
