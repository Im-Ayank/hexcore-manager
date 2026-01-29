const prisma = require("../../services/prisma");
const { ChannelType } = require("discord.js");
const permissionCheck = require("../../utils/permissionCheck");
const confirmationEmbed = require("../../utils/confirmationEmbed");

module.exports = {
  name: "setappealcategory",
  description: "Set appeal category (picker or ID)",
  prefix: true,
  slash: true,
  userPermissions: ["Administrator"],

  options: [
    {
      name: "category",
      description: "Select appeal category",
      type: 7,
      required: false
    },
    {
      name: "category_id",
      description: "Appeal category ID",
      type: 3,
      autocomplete: true,
      required: false
    }
  ],

  // 🔍 AUTOCOMPLETE
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const choices = interaction.guild.channels.cache
      .filter(c =>
        c.type === ChannelType.GuildCategory &&
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

    let category =
      ctx.getChannel("category") ||
      ctx.guild.channels.cache.get(ctx.getString("category_id"));

    if (!category || category.type !== ChannelType.GuildCategory) {
      return ctx.reply("❌ Invalid category.");
    }

    const embed = confirmationEmbed({
      title: "Confirm Appeal Category",
      fields: [
        { name: "Category", value: category.name },
        { name: "ID", value: category.id }
      ]
    });

    await prisma.guild.update({
      where: { id: ctx.guild.id },
      data: {
        appealCategoryIds: { set: [category.id] }
      }
    });

    ctx.reply({ embeds: [embed] });
  }
};
