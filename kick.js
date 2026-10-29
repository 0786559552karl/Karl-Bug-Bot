module.exports = {
  name: "kick",
  category: "group",
  description: "Remove a member from the group (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply, quotedSender, args }) => {
    const target = quotedSender || (args[0] && args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net");
    if (!target) return reply("Reply to the member or provide their number.");
    await sock.groupParticipantsUpdate(from, [target], "remove");
    await reply("Member removed.");
  }
};
