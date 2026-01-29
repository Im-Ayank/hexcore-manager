const prisma = require("../../services/prisma");
const { setupMuteRole } = require("../../services/muteRole.service");
const applyMutePermissions = require("../../utils/applyMutePermissions");
const permissionCheck = require("../../utils/permissionCheck");

module.exports = {
  name: "setupmute",
  description: "Setup mute system",
  prefix: true,
  slash: true,
  userPermissions: ["Administrator"],
  botPermissions: ["ManageRoles", "ManageChannels"],
  options: [
    {
      name: "force_new",
      description: "Force create new mute role",
      type: 5
    }
  ],

  async execute(ctx) {
    // ✅ PERMISSION SANITY CHECK (CORRECT PLACE)
    permissionCheck(ctx.guild);

    const forceNew = ctx.getBoolean?.("force_new") || false;

    try {
      const result = await setupMuteRole(ctx.guild, forceNew);

      if (result.detected) {
        return ctx.reply(
          "⚠️ Existing mute roles detected:\n" +
          result.detected.join("\n") +
          "\nUse `/setupmute force_new:true` to override."
        );
      }

      const config = await prisma.guild.findUnique({
        where: { id: ctx.guild.id }
      });

      await applyMutePermissions({
        guild: ctx.guild,
        muteRole: result.role,
        allowedChannels: config.appealChannelIds,
        allowedCategories: config.appealCategoryIds
      });

      ctx.reply("✅ Mute system configured successfully.");
    } catch (e) {
      ctx.reply(`❌ Setup failed: ${e.message}`);
    }
  }
};
