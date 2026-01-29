const prisma = require("../../services/prisma");
const { createCase } = require("../../services/moderation");
const canModerate = require("../../utils/hierarchy");
const sendAppealDM = require("../../utils/appealDM");

module.exports = {
  name: "mute",
  description: "Mute a user (appeal-only access)",
  prefix: true,
  slash: true,
  userPermissions: ["ModerateMembers"],
  botPermissions: ["ManageRoles"],

  async execute({ guild, member, args, reply }) {
    const target = guild.members.cache.get(args[0]?.replace(/\D/g, ""));
    if (!target) return reply("User not found.");

    if (!canModerate(member, target, guild)) {
      return reply("You cannot mute this user.");
    }

    const config = await prisma.guild.findUnique({
      where: { id: guild.id }
    });

    if (!config?.muteRoleId) {
      return reply("Mute system not set up. Run `setupmute` first.");
    }

    const muteRole = guild.roles.cache.get(config.muteRoleId);
    if (!muteRole) return reply("Mute role missing.");

    const reason = args.slice(1).join(" ") || "No reason provided";

    await target.roles.add(muteRole, reason);

    await createCase({
      guildId: guild.id,
      userId: target.id,
      action: "MUTE",
      reason,
      moderator: member.id
    });

    await sendAppealDM({
      user: target.user,
      guild,
      reason
    });

    reply(`🔇 **${target.user.tag}** has been muted.`);
  }
};
module.exports = {
  name: "mute",
  description: "Mute a user",
  prefix: true,
  slash: true,
  options: [
    {
      name: "user",
      description: "User to mute",
      type: 6,
      required: true
    },
    {
      name: "reason",
      description: "Reason",
      type: 3
    }
  ],
  userPermissions: ["ModerateMembers"],

  async execute(ctx) {
    const targetUser = ctx.getUser("user");
    const reason = ctx.getString("reason") || "No reason provided";

    const target = await ctx.guild.members.fetch(targetUser.id);

    // existing mute logic continues
  }
};
