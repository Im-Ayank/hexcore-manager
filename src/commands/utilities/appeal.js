const prisma = require("../../services/prisma");
const { createAppeal } = require("../../services/appeal.service");
const appealMessage = require("../../utils/appealMessage");

module.exports = {
  name: "appeal",
  description: "Submit a moderation appeal",
  prefix: true,
  slash: true,
  options: [
    {
      name: "reason",
      description: "Why should you be unmuted?",
      type: 3,
      required: true
    }
  ],

  async execute(ctx) {
    // ✅ ACK IMMEDIATELY (CRITICAL)
    if (ctx.reply.defer) {
      await ctx.reply.defer({ ephemeral: true });
    }

    const reason = ctx.getString("reason");

    const guildConfig = await prisma.guild.findUnique({
      where: { id: ctx.guild.id }
    });

    if (!guildConfig?.appealChannelIds?.length) {
      return ctx.reply.edit("❌ Appeal system is not configured.");
    }

    const channel = ctx.guild.channels.cache.get(
      guildConfig.appealChannelIds[0]
    );

    if (!channel) {
      return ctx.reply.edit("❌ Appeal channel missing.");
    }

    const appeal = await createAppeal({
      guildId: ctx.guild.id,
      userId: ctx.user.id,
      reason
    });

    const { embed, buttons } = appealMessage({
      appealId: appeal.id,
      user: ctx.user,
      reason
    });

    await channel.send({
      embeds: [embed],
      components: [buttons]
    });

    // ✅ FINAL RESPONSE
    await ctx.reply.edit("✅ Your appeal has been submitted.");
  }
};
