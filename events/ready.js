const Event = require('@structures/framework/Event');
module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
    });
  }

  async run(client) {
    console.log(`Logged in as ${client.user.tag}`);

    async function setupInit() {
      // Set the game as the "Watching for tags"
      client.user.setActivity(`servers • /help`, { type: "WATCHING" });
    }

    setupInit();
    this.activityInterval = setInterval(setupInit, 90000);

    // Setup the website.
    if((!client.shard || !client.shardId) && client.config.restapi.port != null) {
      client.site = new (require("@structures/restapi/index.js"))(client);
      client.site.listen(client.config.restapi.port);
    }
    
    if(client.guilds.cache.has('783178035322159156')) client.guilds.cache.get('783178035322159156').commands.set(client.commands.map(m=>m.commandData))
    // client.application.commands.set(client.commands.map(m=>m.commandData));
  }
}