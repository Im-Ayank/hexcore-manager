const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");

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

const { Events } = require("discord.js");

client.once(Events.ClientReady, (c) => {
  console.log(`Hexcore Manager logged in as ${c.user.tag}`);
});

client.login(config.discord.token);
