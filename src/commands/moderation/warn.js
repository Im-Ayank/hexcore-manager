const { createCase } = require("../../services/moderation");
const sendModerationDM = require("../../utils/moderationDM");

module.exports = {
  name: "warn",
  description: "Warn a member",
  category: "moderation",
  slash: true,
  prefix: true,
  userPermissions: ["ModerateMembers"],

  async execute({ guild, member, args, reply }) {
    const targetId = args[0]?.replace(/\D/g, "");
    if (!targetId) return reply("Provide a user to warn.");

    const reason = args.slice(1).join(" ") || "No reason provided";
    const targetUser = await guild.client.users.fetch(targetId);

    await createCase({
      guildId: guild.id,
      userId: targetId,
      action: "WARN",
      reason,
      moderator: member.id
    });

    await sendModerationDM({
      user: targetUser,
      guild,
      action: "Warned",
      reason,
      moderator: member.id
    });

    reply(`⚠️ **${targetUser.tag}** has been warned.`);
  }
};
