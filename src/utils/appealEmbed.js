const { EmbedBuilder } = require("discord.js");

module.exports = function appealEmbed({
  appealId,
  user,
  reason,
  status = "PENDING"
}) {
  return new EmbedBuilder()
    .setColor(
      status === "APPROVED"
        ? 0x2ecc71
        : status === "REJECTED"
        ? 0xe74c3c
        : 0xf1c40f
    )
    .setTitle(`Appeal #${appealId}`)
    .addFields(
      { name: "User", value: `<@${user.id}> (${user.id})` },
      { name: "Reason", value: reason },
      { name: "Status", value: status }
    )
    .setTimestamp();
};
