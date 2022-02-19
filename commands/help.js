const Command = require('@structures/framework/Command');
module.exports = class extends Command {
  constructor(client) {
    super(client, {
      enabled: true,
      description: 'Get a list of commands.',
      options: [
        {
          type: 'STRING',
          name: 'command',
          description: 'The full name of the command to view.',
        }
      ],
      category: "General",
    })

    this.runInteraction = this.runMessage = this.helpMenu;
  }

  async helpMenu(ctx) {
    const embed = new ctx.MessageEmbed().setColor('BLURPLE');
      
    if (ctx.args.getString('command')) return this.commandInfo(ctx, ctx.args.getString('command'), embed);
    
    embed
      .setAuthor({ name: ctx.client.user.username, iconURL: ctx.client.user.displayAvatarURL({ dynamic: true, format: 'png' }) })
      .setDescription(`You can do \`${ctx.prefix}help [command]\` for more info on a command\nYou can also join the [support server](${ctx.client.config.supportServerInvite}) for more information.`)
      .addField('➤ General', ctx.client.commands.filter(m => m.conf.category == "General").map(m => `\`${m.commandData.name}\``).join(' ') || 'None')
      .addField('➤ Backups', ctx.client.commands.filter(m => m.conf.category == "Backups").map(m => `\`${m.commandData.name}\``).join(' ') || 'None')
      .setFooter({text: "This bot is using a boilerplate from github.com/DanPlayz0/DiscordBot-Boilerplate"});
    ctx.sendMsg(embed)
  }

  async commandInfo(ctx, command, embed) {
    if (!ctx.client.commands.has(command)) {
      embed
        .setTitle('Something went wrong!')
        .setColor('RED')
        .setDescription(`It seems **${command}** not a valid command name`);
    } else {
      command = ctx.client.commands.get(command); 
      embed
        .setTitle(`Help » ${command.commandData.name.toProperCase()}`)
        .setDescription(`\`\`\`asciidoc\nDescription:: ${command.commandData.description}\nUsage:: ${ctx.prefix}${command.commandData.name} ${command.commandData.options.map(m=>m.required?`<${m.name}>`:`[${m.name}]`).join(' ')}\nCategory:: ${command.conf.category}\`\`\``)
    }
    return ctx.sendMsg(embed);
  }
}