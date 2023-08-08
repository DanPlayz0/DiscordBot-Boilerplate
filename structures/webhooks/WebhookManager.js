const { EmbedBuilder, WebhookClient: DiscordWebhookClient } = require('discord.js');

module.exports = class WebhookManager {
  constructor(client) {
    this.client = client;

    if(!client.config.webhooks) throw TypeError("Config is missing 'webhooks' property");
    for(const webhookName of ["shard", "error", "guilds", "command"]) {
      const webhookConfig = client.config?.webhooks?.[webhookName];
      if (!webhookConfig) continue;
      if (!this.checkValid(webhookConfig.url)) webhookConfig.url = undefined;
      if (!this.checkValid(webhookConfig.id)) webhookConfig.id = undefined;
      if (!this.checkValid(webhookConfig.token)) webhookConfig.token = undefined;

      if (webhookConfig.id && webhookConfig.token || webhookConfig.url) this[webhookName] = new WebhookClient(this.client, webhookName, webhookConfig);
      else this[webhookName] = { send: (content) => console.log(`[WEBHOOK - ${webhookName}]`, content?.content ?? content) };
    }
  }

  checkValid(config) {
    if(config == null) return false;
    if(config == "null") return false;
    if(config == undefined) return false;
    if(config == "undefined") return false;
    if(config == "") return false;
    if(config == " ") return false;
    if(config == "WEBHOOK_URL") return false;
    if(config == "WEBHOOK_ID") return false;
    if(config == "WEBHOOK_TOKEN") return false;
    return true;
  }
}

class WebhookClient {
  constructor(client, name, webhookConfig) {
    this.client = client;
    if(!webhookConfig) return {send: ()=>{ console.error(`Config is missing property 'webhooks.${name}'`) }};
    this.webhook = new DiscordWebhookClient(webhookConfig);
  }

  async send(content, options) {
    if (!content) throw ReferenceError('content is not defined');
    if (typeof content == 'object' && !(content instanceof EmbedBuilder)) { options = content; content = undefined; }
    if (options instanceof EmbedBuilder) options = { embeds: [options] };

    const newOptions = Object.assign({
      content: typeof content === 'string' ? content : undefined,
      embeds: content instanceof EmbedBuilder ? [content] : [],
      allowedMentions: { repliedUser: false, parse: [] },
    }, options);

    return this.webhook.send(newOptions);
  }
}