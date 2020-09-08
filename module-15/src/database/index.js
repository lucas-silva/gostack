import 'dotenv/config';

import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import mongoConfig from '../config/mongo';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import Courier from '../app/models/Courier';
import Package from '../app/models/Package';

const models = [User, Recipient, File, Appointment, Courier, Package];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(mongoConfig.url, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
