module.exports = {
  name: "setdesc",
  category: "group",
  description: "Change the group description (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply, args }) => {
    if (!args.length) return reply("Usage: .setdesc <text>");
    await sock.groupUpdateDescription(from, args.join(" "));
    await reply("Group description updated.");
  }
};
