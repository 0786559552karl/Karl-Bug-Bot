module.exports = {
  name: "promote",
  category: "group",
  description: "Make a member admin (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply, quotedSender }) => {
    if (!quotedSender) return reply("Reply to the member you want to promote.");
    await sock.groupParticipantsUpdate(from, [quotedSender], "promote");
    await reply("Member promoted to admin.");
  }
};
