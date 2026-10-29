module.exports = {
  name: "groupinfo",
  category: "group",
  description: "Show group information",
  groupOnly: true,
  run: async ({ sock, from, reply }) => {
    const meta = await sock.groupMetadata(from);
    await reply(
      `Group: ${meta.subject}\n` +
      `Members: ${meta.participants.length}\n` +
      `Description: ${meta.desc || "none"}`
    );
  }
};
