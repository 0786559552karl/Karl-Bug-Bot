module.exports = {
  name: "unmute",
  category: "group",
  description: "Everyone can send messages again (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply }) => {
    await sock.groupSettingUpdate(from, "not_announcement");
    await reply("Group unmuted. Everyone can send messages.");
  }
};
