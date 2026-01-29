const prisma = require("../../services/prisma");

module.exports = async (client, guild) => {
  try {
    await prisma.guild.upsert({
      where: { id: guild.id },
      update: {},
      create: {
        id: guild.id
      }
    });

    console.log(`Guild initialized: ${guild.name} (${guild.id})`);
  } catch (err) {
    console.error("Guild create error:", err);
  }
};
