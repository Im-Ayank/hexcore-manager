const config = require("../config");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (
      !message.guild ||
      message.author.bot ||
      !message.content.startsWith(config.discord.prefix)
    ) return;

    const args = message.content
      .slice(config.discord.prefix.length)
      .trim()
      .split(/\s+/);

    const cmdName = args.shift().toLowerCase();
    const command = client.commands.get(cmdName);

    if (!command || !command.prefix) return;

    if (
      command.userPermissions &&
      !message.member.permissions.has(command.userPermissions)
    ) {
      return message.reply("You lack permission to use this command.");
    }

    await command.execute({
      client,
      guild: message.guild,
      user: message.author,
      member: message.member,
      args,
      reply: (msg) => message.reply(msg)
    });
  });
};
