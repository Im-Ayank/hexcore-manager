const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = function appealMessage({ appealId, user, reason }) {
  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle(`Appeal #${appealId}`)
    .addFields(
      { name: "User", value: `<@${user.id}> (${user.id})` },
      { name: "Reason", value: reason },
      { name: "Status", value: "PENDING" }
    )
    .setFooter({ text: "Hexcore Manager • Appeal System" })
    .setTimestamp();

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`appeal_approve:${appealId}`)
      .setLabel("Approve")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`appeal_reject:${appealId}`)
      .setLabel("Reject")
      .setStyle(ButtonStyle.Danger)
  );

  return { embed, buttons };
};
