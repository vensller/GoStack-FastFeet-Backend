import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Address from '../app/models/Address';

import databaseConfig from '../config/database';

const models = [User, Address, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }

  async startTransaction() {
    return this.connection.transaction();
  }
}

export default new Database();
