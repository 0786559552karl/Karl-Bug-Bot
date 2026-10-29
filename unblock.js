module.exports = {
  name: "unblock",
  category: "owner",
  description: "Unblock the sender of a replied message (owner only)",
  ownerOnly: true,
  run: async ({ sock, reply, quotedSender }) => {
    if (!quotedSender) return reply("Reply to a message from the user you want to unblock.");
    await sock.updateBlockStatus(quotedSender, "unblock");
    await reply("User unblocked.");
  }
};
