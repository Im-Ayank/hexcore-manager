const { EmbedBuilder } = require("discord.js");

module.exports = async function sendModerationDM({
  user,
  guild,
  action,
  reason,
  moderator
}) {
  try {
    const embed = new EmbedBuilder()
      .setColor(0xff5555)
      .setTitle(`Moderation Action: ${action}`)
      .addFields(
        { name: "Server", value: guild.name, inline: true },
        { name: "Action", value: action, inline: true },
        { name: "Reason", value: reason || "No reason provided", inline: false },
        {
          name: "Moderator",
          value: moderator ? `<@${moderator}>` : "System",
          inline: true
        }
      )
      .setFooter({ text: "Hexcore Manager" })
      .setTimestamp();

    await user.send({ embeds: [embed] });
  } catch (err) {
    // DM closed / blocked — ignore silently
  }
};
