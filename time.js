const moment = require("moment-timezone");
module.exports = {
  name: "time",
  category: "general",
  description: "Get the current date and time",
  run: async ({ reply, args }) => {
    const tz = args[0] || "Africa/Harare";
    const now = moment().tz(tz);
    await reply(`Current time (${tz}): ${now.format("dddd, D MMMM YYYY - HH:mm:ss")}`);
  }
};
