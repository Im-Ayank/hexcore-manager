const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");

const loadCommands = require("./handlers/command.handler");
const loadEvents = require("./handlers/event.handler");
const loadPrefix = require("./handlers/prefix.handler");
const registerSlash = require("./handlers/slash.register");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel]
});

loadCommands(client);
loadEvents(client);
loadPrefix(client);

client.login(config.discord.token);

// register slash commands AFTER ready
client.once("ready", async () => {
  await registerSlash(client);
});
