import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        street: Sequelize.STRING,
        house_number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        recipient_id: Sequelize.INTEGER,
        full_address: {
          type: Sequelize.VIRTUAL,
          get() {
            return `Rua ${this.street}, ${this.house_number}. ${this.city} - ${this.state} - ${this.zip_code} ${this.complement}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
  }
}

export default Address;
