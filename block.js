module.exports = {
  name: "block",
  category: "owner",
  description: "Block the sender of a replied message (owner only)",
  ownerOnly: true,
  run: async ({ sock, reply, quotedSender }) => {
    if (!quotedSender) return reply("Reply to a message from the user you want to block.");
    await sock.updateBlockStatus(quotedSender, "block");
    await reply("User blocked.");
  }
};
