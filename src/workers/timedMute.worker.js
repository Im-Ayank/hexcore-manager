const prisma = require("../services/prisma");

module.exports = (client) => {
  setInterval(async () => {
    const expired = await prisma.timedMute.findMany({
      where: {
        expiresAt: {
          lte: new Date()
        }
      }
    });

    for (const mute of expired) {
      const guild = client.guilds.cache.get(mute.guildId);
      if (!guild) continue;

      const config = await prisma.guild.findUnique({
        where: { id: guild.id }
      });

      const role = guild.roles.cache.get(config.muteRoleId);
      const member = await guild.members.fetch(mute.userId).catch(() => null);

      if (member && role) {
        await member.roles.remove(role, "Timed mute expired");
      }

      await prisma.timedMute.delete({
        where: { id: mute.id }
      });
    }
  }, 60 * 1000);
};
