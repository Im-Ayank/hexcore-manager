const config = require("../config");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    try {
      if (
        !message.guild ||
        message.author.bot ||
        !message.content.startsWith(config.discord.prefix)
      ) return;

      const args = message.content
        .slice(config.discord.prefix.length)
        .trim()
        .split(/\s+/);

      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const command = client.commands.get(commandName);
      if (!command || !command.prefix) return;

      // Permission check
      if (
        command.userPermissions &&
        !message.member.permissions.has(command.userPermissions)
      ) {
        return message.reply("❌ You lack permission to use this command.");
      }

      // NORMALIZED CONTEXT (prefix)
      await command.execute({
        client,
        guild: message.guild,
        member: message.member,
        user: message.author,

        reply: (msg) => message.reply(msg),

        getUser: () =>
          message.mentions.users.first() ||
          message.guild.members.cache.get(args[0])?.user,

        getChannel: () =>
          message.mentions.channels.first(),

        getString: () => args.slice(1).join(" "),

        getBoolean: () => args[0] === "true"
      });
    } catch (err) {
      console.error("Prefix command error:", err);
      message.reply("⚠️ An error occurred while executing this command.");
    }
  });
};
