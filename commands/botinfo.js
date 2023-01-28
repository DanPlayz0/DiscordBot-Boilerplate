const Command = require('@structures/framework/Command');
module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: 'Get information about the bot.',
      options: [],
      access: "developer", // Only admins (configured in config) can use this command.
      category: "General",
    })
  }

  async run(ctx) {
    const duration = ctx.client.moment.duration(ctx.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    let os = "Unknown";
    if (process.platform) {
      const platform = process.platform;
      if (platform === 'win32') os = 'Windows';
      else if (platform === 'aix') os = 'Aix';
      else if (platform === 'linux') os = 'Linux';
      else if (platform === 'darwin') os = 'Darwin';
      else if (platform === 'openbsd') os = 'OpenBSD';
      else if (platform === 'sunos') os = 'Solaris';
      else if (platform === 'freebsd') os = 'FreeBSD';
    }

    const table = new AsciiTable()
      .setHeading('Shard', 'Servers', 'Users', 'Ping')
      .setAlign(0, AsciiTable.CENTER)
      .setAlign(1, AsciiTable.CENTER)
      .setAlign(2, AsciiTable.CENTER)
      .setAlign(3, AsciiTable.CENTER)
    const guildCount = ctx.client.shard ? await ctx.client.shard.fetchClientValues('guilds.cache.size') : [ctx.client.guilds.cache.size]
    const ping = ctx.client.shard ? await ctx.client.shard.fetchClientValues('ws.ping') : [ctx.client.ws.ping]
    const users = ctx.client.shard ? await ctx.client.shard.broadcastEval((bot) => bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) : [ctx.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)]
    guildCount.map((count, shardId) => {
      table.addRow(shardId, count.toLocaleString(), `${users[shardId].toLocaleString()}`, `${ping[shardId]}ms`)
    })
    table.addRow()
    table.addRow(`Total`, `${guildCount.reduce((servers, num) => num + servers, 0).toLocaleString()}`, `${users.reduce((users, num) => num + users, 0).toLocaleString()}`, `${Math.round(ping.reduce((users, num) => num + users, 0) / ping.length)}ms`)

    const e = new ctx.MessageEmbed()
      .setTitle('Bot Info')
      .setColor('Blurple')
      .setFields([
        {name: 'Uptime', value: duration, inline: true},
        {name: 'User Count', value: `${users.reduce((users, num) => num + users, 0).toLocaleString()} users`, inline: true},
        {name: 'Server Count', value: `${guildCount.reduce((servers, num) => num + servers, 0).toLocaleString()} servers`, inline: true},
        {name: 'Operating System', value: os, inline: true},
        {name: 'Node Version', value: process.version, inline: true},
        {name: 'Discord.js Version', value: `v${version}`, inline: true},
        {name: '\u200b', value: `\`\`\`\n${table.toString()}\`\`\``, inline: true},
      ])
      .setTimestamp()
      .setFooter({ text: ctx.author.username, iconURL: ctx.author.avatarURL() });
    ctx.interaction.editReply({embeds:[e]});
  }
}