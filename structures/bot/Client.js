const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = class BotClient extends Discord.Client {
  constructor(options) {
    super(options);

    // Configuration
    this.config = require('@root/config');

    // Collections
    for (const name of ["commands", "events", "cooldowns"]) this[name] = new Discord.Collection();

    // Packages
    this.discord = Discord;
    this.fs = fs;
    this.moment = require('moment'); require("moment-timezone"); require("moment-duration-format");
    this.duration = require("humanize-duration");

    // Miscelaneous
    this.framework = {
      messageContext: require("@structures/framework/ContextMessage"),
      messageArguments: require("@structures/framework/MessageArguments"),
      interactionContext: require("@structures/framework/ContextInteraction"),
    }
    this.database = new (require('./DatabaseManager.js'))(this);
    this.redis = this.config.redis.host == null ? ({ get: () => Error("Disabled"), setex: () => Error("Disabled") }) : new (require('ioredis'))(`redis://${this.config.redis.host}:${this.config.redis.port}`);
    this.webhooks = new (require('@structures/webhooks/WebhookManager.js'))(this);
    this.loader = new (require('./Loader.js'))(this);
    this.accesslevels = new (require('../handlers/accessLevels.js'))(this);

    this.database.init();
    this.loader.start();
  }

  async stop() {
    await this.database.raw.close();
    await this.redis.disconnect();
    await this.destroy();
    process.exit(0);
  }
}