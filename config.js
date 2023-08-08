require('dotenv').config();

module.exports = {
  // Bot Token
  token: process.env.TOKEN,

  // Bot Administators (Access to Admin Dash & System Commands)
  admins: ['209796601357533184', '229285505693515776'],
  
  // Database Crap (MongoDB & Redis)
  mongo_uri: process.env.MONGODB_URI,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? "6379"),
    prefix: process.env.REDIS_PREFIX ?? "DISCORDBOT:",
  },
  
  // Support server. (For the "dashboard.example/join")
  supportServerInvite: "https://discord.gg/KkS6yP8",
  
  // Domain (Used for Auth, RestApi & Links)
  domain: "https://example.com",
  
  // Restful API
  restapi: {
    port: parseInt(process.env.RESTFUL_PORT ?? "3000"),
  },
  
  // Bot Logging (Webhooks)
  webhooks: {
    shard: { url: process.env.SHARD_WEBHOOK_URL },
    error: { url: process.env.ERROR_WEBHOOK_URL },
    guilds: { url: process.env.GUILD_WEBHOOK_URL },
    command: { url: process.env.COMMAND_WEBHOOK_URL },
  },

  // Bot settings (Default)
  settings: {
    prefix: '!',
  },

}