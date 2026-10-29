module.exports = {
  name: "demote",
  category: "group",
  description: "Remove admin from a member (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply, quotedSender }) => {
    if (!quotedSender) return reply("Reply to the member you want to demote.");
    await sock.groupParticipantsUpdate(from, [quotedSender], "demote");
    await reply("Member demoted.");
  }
};
