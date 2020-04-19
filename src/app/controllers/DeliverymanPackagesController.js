import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Address from '../models/Address';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliverymanPackagesController {
  async index(req, res) {
    return res.json(
      await Delivery.findAll({
        where: {
          canceled_at: null,
          end_date: req.query.delivered
            ? {
                [Op.not]: null,
              }
            : null,
          deliveryman_id: req.params.deliveryman_id,
        },
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name'],
            include: [
              {
                model: Address,
                as: 'address',
              },
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'path', 'url'],
          },
        ],
      })
    );
  }
}

export default new DeliverymanPackagesController();
