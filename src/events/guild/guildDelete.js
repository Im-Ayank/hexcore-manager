const prisma = require("../../services/prisma");

module.exports = async (client, guild) => {
  try {
    console.log(`Guild removed: ${guild.name} (${guild.id})`);
    // We DO NOT delete data (for rejoin & analytics)
  } catch (err) {
    console.error("Guild delete error:", err);
  }
};
