module.exports = function canModerate(moderator, target, guild) {
  if (!target) return false;
  if (moderator.id === guild.ownerId) return true;
  if (target.id === guild.ownerId) return false;

  return moderator.roles.highest.position > target.roles.highest.position;
};
