const prisma = require("./prisma");

async function createCase({ guildId, userId, action, reason, moderator }) {
  return prisma.moderationCase.create({
    data: {
      guildId,
      userId,
      action,
      reason,
      moderator
    }
  });
}

module.exports = {
  createCase
};
