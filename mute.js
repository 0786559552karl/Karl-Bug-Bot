module.exports = {
  name: "mute",
  category: "group",
  description: "Only admins can send messages (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply }) => {
    await sock.groupSettingUpdate(from, "announcement");
    await reply("Group muted. Only admins can send messages.");
  }
};
