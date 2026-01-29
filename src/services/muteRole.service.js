const prisma = require("./prisma");

const MUTE_ROLE_NAME = "Hexcore Muted";

async function validatePosition(botMember, muteRole) {
  if (botMember.roles.highest.position <= muteRole.position) {
    throw new Error("Bot role must be ABOVE the mute role.");
  }
}

async function detectMuteRoles(guild) {
  return guild.roles.cache.filter(r =>
    r.name.toLowerCase().includes("mute")
  );
}

async function createMuteRole(guild, botMember) {
  const role = await guild.roles.create({
    name: MUTE_ROLE_NAME,
    permissions: [],
    reason: "Hexcore Manager mute system"
  });

  await validatePosition(botMember, role);

  await prisma.guild.update({
    where: { id: guild.id },
    data: { muteRoleId: role.id }
  });

  return role;
}

async function setupMuteRole(guild, forceNew = false) {
  const botMember = guild.members.me;
  if (!botMember) throw new Error("Bot member not found");

  const config = await prisma.guild.findUnique({
    where: { id: guild.id }
  });

  if (config?.muteRoleId && !forceNew) {
    const existing = guild.roles.cache.get(config.muteRoleId);
    if (existing) {
      await validatePosition(botMember, existing);
      return { role: existing, reused: true };
    }
  }

  const detected = detectMuteRoles(guild);
  if (detected.size && !forceNew) {
    return {
      detected: detected.map(r => `${r.name} (${r.id})`)
    };
  }

  const role = await createMuteRole(guild, botMember);
  return { role, created: true };
}

module.exports = { setupMuteRole };
