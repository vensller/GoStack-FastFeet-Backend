import Sequelize, { Model } from 'sequelize';
import DeliveryStatus from '../enumerates/DeliveryStatus';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.canceled_at) {
              return DeliveryStatus[3];
            }

            if (!this.start_date) {
              return DeliveryStatus[0];
            }

            if (!this.canceled_at && !this.end_date) {
              return DeliveryStatus[1];
            }

            if (this.end_date) {
              return DeliveryStatus[2];
            }

            return DeliveryStatus[4];
          },
        },
      },
      {
        sequelize,
        tableName: 'deliveries',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.hasMany(models.DeliveryProblem, { foreignKey: 'delivery_id' });
  }
}

export default Delivery;
