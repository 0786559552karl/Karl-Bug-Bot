module.exports = {
  name: "broadcast",
  aliases: ["bc"],
  category: "owner",
  description: "Send a message to all known chats (owner only)",
  ownerOnly: true,
  run: async ({ sock, reply, args, store }) => {
    if (!args.length) return reply("Usage: .broadcast <message>");
    const chats = store.getAllChatIds ? await store.getAllChatIds() : [];
    let count = 0;
    for (const chatId of chats) {
      try {
        await sock.sendMessage(chatId, { text: args.join(" ") });
        count++;
      } catch (e) {}
    }
    await reply(`Broadcast sent to ${count} chats.`);
  }
};
