const prisma = require("../../services/prisma");
const permissionCheck = require("../../utils/permissionCheck");
const confirmationEmbed = require("../../utils/confirmationEmbed");

module.exports = {
  name: "setappealchannel",
  description: "Set appeal channel (picker or ID)",
  prefix: true,
  slash: true,
  userPermissions: ["Administrator"],

  options: [
    {
      name: "channel",
      description: "Select appeal channel",
      type: 7,
      required: false
    },
    {
      name: "channel_id",
      description: "Appeal channel ID",
      type: 3,
      autocomplete: true,
      required: false
    }
  ],

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const choices = interaction.guild.channels.cache
      .filter(c =>
        c.isTextBased() &&
        c.id.startsWith(focused)
      )
      .map(c => ({
        name: `${c.name} (${c.id})`,
        value: c.id
      }))
      .slice(0, 25);

    await interaction.respond(choices);
  },

  async execute(ctx) {
    permissionCheck(ctx.guild);

    let channel =
      ctx.getChannel("channel") ||
      ctx.guild.channels.cache.get(ctx.getString("channel_id"));

    if (!channel || !channel.isTextBased()) {
      return ctx.reply("❌ Invalid text channel.");
    }

    const embed = confirmationEmbed({
      title: "Confirm Appeal Channel",
      fields: [
        { name: "Channel", value: channel.name },
        { name: "ID", value: channel.id }
      ]
    });

    await prisma.guild.update({
      where: { id: ctx.guild.id },
      data: {
        appealChannelIds: { set: [channel.id] }
      }
    });

    ctx.reply({ embeds: [embed] });
  }
};
