require("dotenv").config();

function requireEnv(key) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return process.env[key];
}

module.exports = {
  env: process.env.NODE_ENV || "production",

  discord: {
    token: requireEnv("DISCORD_TOKEN"),
    clientId: requireEnv("CLIENT_ID"),
    prefix: process.env.PREFIX || "!"
  },

  database: {
    url: requireEnv("DATABASE_URL")
  },

  redis: {
    url: requireEnv("REDIS_URL")
  }
};
