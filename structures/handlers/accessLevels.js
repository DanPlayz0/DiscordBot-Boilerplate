module.exports = class AccessLevels {
  constructor(client) {
    this.client = client;

    this.access = [
      {name: "user", level: 0},
      {name: "moderator", level: 1},
      {name: "administrator", level: 2},
      {name: "owner", level: 3},
      {name: "developer", level: 99},
    ];
  }

  getAccess(member) {
    if(this.client.config.admins.includes(member.id)) return this.access.find(m=>m.name==="developer");
    if(member.guild) {
      if(member.id === member.guild.ownerId) return this.access.find(m=>m.name==="owner");
      else if(member.permissions.has('ManageGuild')) return this.access.find(m=>m.name==="administrator");
      else if(member.permissions.has('KickMembers')) return this.access.find(m=>m.name==="moderator");
    }
    return this.access.find(m=>m.name==="user");
  }

  checkAccess(member, accessLevel = 'user') {
    const currentAccess = this.getAccess(member);
    const lookingFor = this.access.find(m=>m.name===accessLevel||m.level===accessLevel);
    if(currentAccess.level >= lookingFor.level) return true;
    return false;
  }
}