module.exports = async function applyMutePermissions({
  guild,
  muteRole,
  allowedChannels = [],
  allowedCategories = []
}) {
  for (const channel of guild.channels.cache.values()) {
    if (!channel.permissionOverwrites || channel.isThread?.()) continue;

    const isAllowedChannel = allowedChannels.includes(channel.id);
    const isAllowedCategory =
      channel.parentId && allowedCategories.includes(channel.parentId);

    const overwrite = isAllowedChannel || isAllowedCategory
      ? {
          ViewChannel: true,
          SendMessages: true,
          AddReactions: true,
          Speak: true
        }
      : {
          ViewChannel: false,
          SendMessages: false,
          AddReactions: false,
          Speak: false
        };

    try {
      await channel.permissionOverwrites.edit(
        muteRole,
        overwrite,
        { reason: "Hexcore hard mute system" }
      );
    } catch (e) {
      console.error(`Mute perms failed in ${channel.name}:`, e.message);
    }
  }
};
