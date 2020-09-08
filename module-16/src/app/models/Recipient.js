import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        addressLine1: Sequelize.STRING,
        addressLine2: Sequelize.STRING,
        number: Sequelize.INTEGER,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        postalCode: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;
