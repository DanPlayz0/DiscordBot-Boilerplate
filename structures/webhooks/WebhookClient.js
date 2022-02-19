module.exports = class Webhook {
  constructor(client, options) {
    this.client = client;
    this.webhook = new this.client.discord.WebhookClient(options);
  }

  async send(content, options) {
    if (!content) throw ReferenceError('content is not defined');
    if (typeof content == 'object' && !(content instanceof this.client.discord.MessageEmbed)) { options = content; content = undefined; }
    if (options instanceof this.client.discord.MessageEmbed) options = { embeds: [options] };

    const newOptions = Object.assign({
      content: typeof content === 'string' ? content : undefined,
      embeds: content instanceof this.client.discord.MessageEmbed ? [content] : [],
      allowedMentions: { repliedUser: false, parse: [] },
    }, options);

    return this.webhook.send(newOptions);
  }
}