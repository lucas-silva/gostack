import Sequelize, { Model } from 'sequelize';

class Package extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        courier_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        cancelled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });

    this.belongsTo(models.Courier, {
      foreignKey: 'courier_id',
      as: 'courier',
    });

    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Package;
