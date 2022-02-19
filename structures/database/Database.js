const mongoose = require('mongoose');

module.exports = class Database {
  constructor(client) {
    this.client = client;
    this.mongoose = mongoose;
    this.files = {};
    
    const models = require('fs').readdirSync(__dirname + "/models/").filter((m) => /\.js$/.test(m));
    for (const i of models) {
      // this.files[i.toLowerCase().replace(/\.js$/, '')] = require(`./models/${i.toLowerCase()}`);
      this[i.toLowerCase().replace(/\.js$/, '')] = require(`./models/${i.toLowerCase()}`);//.model;
    }
    this.connect();
  }

  connect() {
    return mongoose.connect(this.client.config.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}