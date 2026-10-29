module.exports = {
  name: "jid",
  category: "general",
  description: "Get your or a chat's WhatsApp JID",
  run: async ({ reply, from, sender }) => {
    await reply(`Chat JID: ${from}\nYour JID: ${sender}`);
  }
};
