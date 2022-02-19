const Event = require('@structures/framework/Event');
const Context = require('@structures/framework/ContextMessage');
module.exports = class extends Event {
  constructor(client) {
    super(client, {
      enabled: true,
    });
  }

  async run(client, message) {
    if (message.partial) await message.fetch();
    this.commandUsage(client, message);
  }

  async commandUsage(client, message) {
    if (message.author.bot) return;

    const settings = { prefix: client.config.settings.prefix };

    const serverPrefix = settings.prefix;
    const fixedUsername = escapeRegExp(client.user.username);
    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedUsername}|${escapeRegExp(serverPrefix)})`, 'i', '(\s+)?');
    const mentioned = (new RegExp(`^(<@!?${client.user.id}>)`)).test(message.content);

    let usedPrefix = message.content.match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
    if (!usedPrefix) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    const cmd = client.commands.get(command) //|| client.commands.get(client.aliases.get(command));
    const ctx = new Context({ client, args, message, prefix: serverPrefix, commandType: 'message', commandName: command, commandData: cmd?.commandData ?? {options:[]} });

    const helpPrefix = `👋 Hello! You can use any of the following prefixes: ${['/ (Slash Commands)', serverPrefix].map(m => `\`${m}\``).join(' ')}`;
    if (!cmd && mentioned) return ctx.sendMsg(helpPrefix);
    if (!cmd) return;

    // User Perms
    if (cmd.permissions.user.length > 0 && cmd.permissions.user.every(perm => message.member.permissions.has(Permissions.FLAGS[perm]) === false)) {
      const e = new MessageEmbed()
        .setTitle('Missing User Permissions')
        .setColor('RED')
        .setDescription(`You are missing \`${cmd.permissions.user.filter(p => !message.member.permissions.has(Permissions.FLAGS[p])).join(", ").toUpperCase()}\` to run this command`);
      message.channel.send({ embeds: [e] });
      return;
    }

    // Bot Perm
    if (cmd.permissions.bot.length > 0 && cmd.permissions.bot.every(perm => message.guild.me.permissions.has(Permissions.FLAGS[perm]) === false)) {
      const e = new MessageEmbed()
        .setTitle('Missing Bot Permissions')
        .setColor('RED')
        .setDescription(`I am missing \`${cmd.permissions.bot.filter(p => !message.guild.me.permissions.has(Permissions.FLAGS[p])).join(", ").toUpperCase()}\` to run this command.`);
      message.channel.send({ embeds: [e] });
      return;
    }
    //#endregion

    //#region Command Cooldown System
    let cooldowns = client.cooldowns;
    if (!cooldowns.has(cmd.commandData.name)) {
      cooldowns.set(cmd.commandData.name, new ctx.discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(cmd.commandData.name);
    const cooldownAmount = (cmd.conf.cooldown || 0) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return ctx.sendMsg(`${message.author.toString()}, please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.commandData.name}\` command.`);
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    //#endregion

    // If the command exists, **AND** the user has permission, run it.
    client.webhooks.command.send({ content: `${ctx.author.tag} \`${ctx.author.id}\` used **${cmd.commandData.name}** in ${message.guild.name} \`${message.guild.id}\` ||${ctx.prefix}${command} ${args.join(' ')}`.slice(0, 1995) + '||', allowedMentions: { parse: [] } })
    cmd._entrypoint(ctx, 'message');
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\\`]/g, '\\$&');
}