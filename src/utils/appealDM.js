const { EmbedBuilder } = require("discord.js");

module.exports = async function sendAppealDM({
  user,
  guild,
  reason
}) {
  try {
    const embed = new EmbedBuilder()
      .setColor(0xffaa00)
      .setTitle("You have been muted")
      .addFields(
        { name: "Server", value: guild.name },
        { name: "Reason", value: reason || "No reason provided" },
        {
          name: "Appeal",
          value: "You may appeal in the designated appeal channel."
        }
      )
      .setFooter({ text: "Hexcore Manager" })
      .setTimestamp();

    await user.send({ embeds: [embed] });
  } catch {}
};
