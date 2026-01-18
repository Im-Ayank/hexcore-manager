module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command || !command.slash) return;

  if (
    command.userPermissions &&
    !interaction.memberPermissions.has(command.userPermissions)
  ) {
    return interaction.reply({
      content: "You lack permission to use this command.",
      ephemeral: true
    });
  }

  await command.execute({
    client,
    guild: interaction.guild,
    user: interaction.user,
    member: interaction.member,
    args: [],
    reply: (msg) => interaction.reply(msg)
  });
};
