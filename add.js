module.exports = {
  name: "add",
  category: "group",
  description: "Add a member to the group (admin only)",
  groupOnly: true,
  adminOnly: true,
  run: async ({ sock, from, reply, args }) => {
    if (!args.length) return reply("Usage: .add <number>");
    const number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await sock.groupParticipantsUpdate(from, [number], "add");
    await reply("Member added.");
  }
};
