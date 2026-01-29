const prisma = require("../../services/prisma");

module.exports = {
  name: "prefix",
  description: "Change server prefix",
  category: "admin",
  prefix: true,
  slash: false,
  userPermissions: ["Administrator"],

  async execute({ guild, args, reply }) {
    const newPrefix = args[0];
    if (!newPrefix) return reply("Provide a new prefix.");

    await prisma.guild.update({
      where: { id: guild.id },
      data: { prefix: newPrefix }
    });

    reply(`Prefix updated to \`${newPrefix}\``);
  }
};
