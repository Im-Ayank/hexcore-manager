const { createCase } = require("../../services/moderation");
const canModerate = require("../../utils/hierarchy");
const sendModerationDM = require("../../utils/moderationDM");

module.exports = {
  name: "ban",
  description: "Ban a member from the server",
  category: "moderation",
  slash: true,
  prefix: true,
  userPermissions: ["BanMembers"],
  botPermissions: ["BanMembers"],

  async execute({ guild, member, args, reply }) {
    const target = member.guild.members.cache.get(args[0]?.replace(/\D/g, ""));
    if (!target) return reply("User not found.");

    if (!canModerate(member, target, guild)) {
      return reply("You cannot ban this user.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    await sendModerationDM({
      user: target.user,
      guild,
      action: "Banned",
      reason,
      moderator: member.id
    });

    await target.ban({ reason });

    await createCase({
      guildId: guild.id,
      userId: target.id,
      action: "BAN",
      reason,
      moderator: member.id
    });

    reply(`🔨 **${target.user.tag}** has been banned.`);
  }
};
