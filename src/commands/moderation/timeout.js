const { createCase } = require("../../services/moderation");
const canModerate = require("../../utils/hierarchy");
const sendModerationDM = require("../../utils/moderationDM");

module.exports = {
  name: "timeout",
  description: "Timeout a member",
  category: "moderation",
  slash: true,
  prefix: true,
  userPermissions: ["ModerateMembers"],
  botPermissions: ["ModerateMembers"],

  async execute({ guild, member, args, reply }) {
    const target = member.guild.members.cache.get(args[0]?.replace(/\D/g, ""));
    if (!target) return reply("User not found.");

    if (!canModerate(member, target, guild)) {
      return reply("You cannot timeout this user.");
    }

    const duration = parseInt(args[1]);
    if (!duration) return reply("Provide timeout duration in minutes.");

    const reason = args.slice(2).join(" ") || "No reason provided";

    await target.timeout(duration * 60 * 1000, reason);

    await createCase({
      guildId: guild.id,
      userId: target.id,
      action: "TIMEOUT",
      reason,
      moderator: member.id
    });

    await sendModerationDM({
      user: target.user,
      guild,
      action: `Timeout (${duration} minutes)`,
      reason,
      moderator: member.id
    });

    reply(`⏳ **${target.user.tag}** timed out for ${duration} minutes.`);
  }
};
