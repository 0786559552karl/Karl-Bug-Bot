module.exports = {
  name: "tagall",
  category: "group",
  description: "Mention every member in the group",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply, args }) => {
    const meta = await sock.groupMetadata(from);
    const mentions = meta.participants.map((p) => p.id);
    const text = args.length ? args.join(" ") : "Attention everyone!";
    await sock.sendMessage(from, {
      text: `${text}\n\n` + mentions.map((m) => `@${m.split("@")[0]}`).join(" "),
      mentions
    });
  }
};
