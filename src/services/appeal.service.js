const prisma = require("./prisma");

async function createAppeal({ guildId, userId, reason, caseId }) {
  return prisma.appeal.create({
    data: {
      guildId,
      userId,
      reason,
      caseId
    }
  });
}

async function updateAppeal(id, status, reviewerId) {
  return prisma.appeal.update({
    where: { id },
    data: {
      status,
      reviewerId
    }
  });
}

module.exports = {
  createAppeal,
  updateAppeal
};
