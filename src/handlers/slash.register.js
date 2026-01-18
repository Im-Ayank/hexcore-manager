const { REST, Routes } = require("discord.js");
const config = require("../config");

module.exports = async (client) => {
  const commands = [];

  for (const cmd of client.commands.values()) {
    if (!cmd.slash) continue;

    commands.push({
      name: cmd.name,
      description: cmd.description
    });
  }

  const rest = new REST({ version: "10" }).setToken(config.discord.token);

  await rest.put(
    Routes.applicationCommands(config.discord.clientId),
    { body: commands }
  );

  console.log("Slash commands registered");
};
