module.exports = function permissionCheck(guild) {
  const bot = guild.members.me;
  if (!bot) throw new Error("Bot member not resolved.");

  const required = [
    "ManageRoles",
    "ManageChannels",
    "ViewAuditLog"
  ];

  for (const perm of required) {
    if (!bot.permissions.has(perm)) {
      throw new Error(`Missing required permission: ${perm}`);
    }
  }

  return true;
};
