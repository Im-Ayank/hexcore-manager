const prisma = require("../../services/prisma");
const { createCase } = require("../../services/moderation");
const parseDuration = require("../../utils/parseDuration");
const sendAppealDM = require("../../utils/appealDM");
const canModerate = require("../../utils/hierarchy");

module.exports = {
  name: "mute",
  description: "Mute a user (optionally timed)",
  prefix: true,
  slash: true,
  userPermissions: ["ModerateMembers"],
  botPermissions: ["ManageRoles"],
  options: [
    {
      name: "user",
      description: "User to mute",
      type: 6,
      required: true
    },
    {
      name: "duration",
      description: "Duration (e.g. 10m, 2h, 1d)",
      type: 3,
      required: false
    },
    {
      name: "reason",
      description: "Reason",
      type: 3,
      required: false
    }
  ],

  async execute(ctx) {
    const targetUser = ctx.getUser("user");
    const durationInput = ctx.getString("duration");
    const reason = ctx.getString("reason") || "No reason provided";

    const member = await ctx.guild.members.fetch(targetUser.id);

    if (!canModerate(ctx.member, member, ctx.guild)) {
      return ctx.reply.send("❌ You cannot mute this user.");
    }

    const config = await prisma.guild.findUnique({
      where: { id: ctx.guild.id }
    });

    const muteRole = ctx.guild.roles.cache.get(config.muteRoleId);
    if (!muteRole) {
      return ctx.reply.send("❌ Mute system not set up.");
    }

    const durationMs = parseDuration(durationInput);

    // ❗ SAFETY CHECK
    if (durationInput && !durationMs) {
      return ctx.reply.send(
        "❌ Invalid duration format. Use `10m`, `2h`, or `1d`."
      );
    }

    await member.roles.add(muteRole, reason);

    let expiresAt = null;

    if (durationMs) {
      expiresAt = new Date(Date.now() + durationMs);

      await prisma.timedMute.upsert({
        where: {
          guildId_userId: {
            guildId: ctx.guild.id,
            userId: member.id
          }
        },
        update: { expiresAt },
        create: {
          guildId: ctx.guild.id,
          userId: member.id,
          expiresAt
        }
      });
    }

    await createCase({
      guildId: ctx.guild.id,
      userId: member.id,
      action: durationMs ? "TIMED_MUTE" : "MUTE",
      reason,
      moderator: ctx.user.id
    });

    await sendAppealDM({
      user: member.user,
      guild: ctx.guild,
      reason,
      appealInfo: durationMs
        ? `Mute expires <t:${Math.floor(expiresAt.getTime() / 1000)}:R>`
        : "This mute is permanent unless appealed."
    });

    return ctx.reply.send(
      `🔇 **${member.user.tag}** muted ${
        durationMs
          ? `until <t:${Math.floor(expiresAt.getTime() / 1000)}:R>`
          : "permanently"
      }.`
    );
  }
};
