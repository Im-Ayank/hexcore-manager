const prisma = require("../../services/prisma");
const { createCase } = require("../../services/moderation");

module.exports = {
  name: "unmute",
  description: "Unmute a user",
  prefix: true,
  slash: true,
  userPermissions: ["ModerateMembers"],
  botPermissions: ["ManageRoles"],

  async execute({ guild, member, args, reply }) {
    const target = guild.members.cache.get(args[0]?.replace(/\D/g, ""));
    if (!target) return reply("User not found.");

    const config = await prisma.guild.findUnique({
      where: { id: guild.id }
    });

    const muteRole = guild.roles.cache.get(config?.muteRoleId);
    if (!muteRole) return reply("Mute role not configured.");

    await target.roles.remove(muteRole, "Unmuted");

    await createCase({
      guildId: guild.id,
      userId: target.id,
      action: "UNMUTE",
      moderator: member.id
    });

    reply(`🔊 **${target.user.tag}** has been unmuted.`);
  }
};
module.exports = {
  name: "unmute",
  description: "Unmute a user",
  prefix: true,
  slash: true,
  options: [
    {
      name: "user",
      description: "User to unmute",
      type: 6,
      required: true
    }
  ],
  userPermissions: ["ModerateMembers"],

  async execute(ctx) {
    const targetUser = ctx.getUser("user");
    const target = await ctx.guild.members.fetch(targetUser.id);

    // existing unmute logic
  }
};
