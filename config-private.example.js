module.exports = {
  token: "DISCORD_BOT_TOKEN",

  mongo_uri: "mongodb://username:password@localhost:27017/discordbot?authSource=admin&retryWrites=true&ssl=false",
  redis: {
    host: "localhost",
    port: 6379,
  },

  restapi: {
    port: 3000,
  },

  webhooks: {
    shard: { id: "", token: "" },
    error: { id: "", token: "" },
    command: { id: "", token: "" },
    guilds: { id: "", token: "" },
  }
}