const { EmbedBuilder } = require("discord.js");

module.exports = function confirmationEmbed({
  title,
  fields,
  footer = "Hexcore Manager"
}) {
  return new EmbedBuilder()
    .setColor(0x00ff99)
    .setTitle(title)
    .addFields(fields)
    .setFooter({ text: footer })
    .setTimestamp();
};
