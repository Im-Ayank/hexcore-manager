const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");

const loadCommands = require("./handlers/command.handler");
const loadEvents = require("./handlers/event.handler");
const loadPrefix = require("./handlers/prefix.handler");
const registerSlash = require("./handlers/slash.register");
const startTimedMuteWorker = require("./workers/timedMute.worker");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ],
  partials: [Partials.Channel]
});

// Load systems BEFORE login
loadCommands(client);
loadEvents(client);
loadPrefix(client);

// Login
client.login(config.discord.token);

// Single, clean startup point
client.once("ready", async () => {
  console.log(`Hexcore Manager is online as ${client.user.tag}`);

  // Start background workers
  startTimedMuteWorker(client);

  // Register slash commands
  await registerSlash(client);
});
