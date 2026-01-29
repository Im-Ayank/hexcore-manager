module.exports = async (client, interaction) => {
  try {
    // AUTOCOMPLETE HANDLER
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        return command.autocomplete(interaction);
      }
      return;
    }
const prisma = require("../../services/prisma");
const appealMessage = require("../../utils/appealMessage");

if (interaction.isButton()) {
  const [action, appealIdRaw] = interaction.customId.split(":");
  if (!action.startsWith("appeal_")) return;

  const appealId = Number(appealIdRaw);
  if (!appealId) return;

  // Permission check
  if (
    !interaction.memberPermissions.has("ModerateMembers")
  ) {
    return interaction.reply({
      content: "❌ You lack permission to review appeals.",
      ephemeral: true
    });
  }

  const appeal = await prisma.appeal.findUnique({
    where: { id: appealId }
  });

  if (!appeal || appeal.status !== "PENDING") {
    return interaction.reply({
      content: "⚠️ This appeal has already been resolved.",
      ephemeral: true
    });
  }

  const guild = interaction.guild;
  const config = await prisma.guild.findUnique({
    where: { id: guild.id }
  });

  const muteRole = guild.roles.cache.get(config.muteRoleId);
  const member = await guild.members.fetch(appeal.userId).catch(() => null);

  let status;

  if (action === "appeal_approve") {
    status = "APPROVED";
    if (member && muteRole) {
      await member.roles.remove(muteRole, "Appeal approved");
    }
  } else if (action === "appeal_reject") {
    status = "REJECTED";
  } else return;

  await prisma.appeal.update({
    where: { id: appealId },
    data: {
      status,
      reviewerId: interaction.user.id
    }
  });

  // Update embed + disable buttons
  const { embed } = appealMessage({
    appealId,
    user: { id: appeal.userId },
    reason: appeal.reason
  });

  embed.spliceFields(2, 1, {
    name: "Status",
    value: status
  });

  await interaction.update({
    embeds: [embed],
    components: []
  });

  // DM user
  interaction.client.users.fetch(appeal.userId).then(user => {
    user.send(
      status === "APPROVED"
        ? "✅ Your appeal has been approved. You have been unmuted."
        : "❌ Your appeal has been rejected."
    ).catch(() => {});
  });
}

    // SLASH COMMAND HANDLER
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command || !command.slash) return;

    if (
      command.userPermissions &&
      !interaction.memberPermissions.has(command.userPermissions)
    ) {
      return interaction.reply({
        content: "❌ You lack permission to use this command.",
        ephemeral: true
      });
    }

const ctx = {
  client,
  guild: interaction.guild,
  member: interaction.member,
  user: interaction.user,

  reply: {
    defer: (opts = {}) => interaction.deferReply(opts),
    edit: (msg) => interaction.editReply(msg),
    send: (msg) => interaction.reply(msg)
  },

  getUser: (name) => interaction.options.getUser(name),
  getChannel: (name) => interaction.options.getChannel(name),
  getString: (name) => interaction.options.getString(name),
  getBoolean: (name) => interaction.options.getBoolean(name)
};

    await command.execute(ctx);
  } catch (err) {
    console.error("Interaction error:", err);
    if (!interaction.replied) {
      interaction.reply({
        content: "⚠️ An internal error occurred.",
        ephemeral: true
      });
    }
  }
};
