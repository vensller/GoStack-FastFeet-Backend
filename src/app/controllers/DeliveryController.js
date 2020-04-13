import Sequelize from 'sequelize';
import Delivery from '../models/Delivery';
import Queue from '../../lib/Queue';
import DeliveryMail from '../jobs/DeliveryMail';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Address from '../models/Address';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    return res.json(
      await Delivery.findAll({
        where: {
          canceled_at: null,
          end_date: null,
          deliveryman_id: req.params.deliveryman_id,
          product: {
            [Sequelize.Op.iLike]: `%${
              req.query.product ? req.query.product : ''
            }%`,
          },
        },
        include: [
          {
            model: Address,
            as: 'address',
          },
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

  async store(req, res) {
    if (
      !req.body.deliveryman_id ||
      !req.body.recipient_id ||
      !req.body.address_id
    ) {
      return res
        .status(400)
        .json({ error: 'Recipient, deliveryman and address are necessary' });
    }

    const delivery = await Delivery.create(req.body);

    await Queue.add(DeliveryMail.key, {
      delivery,
      address: req.address,
      recipient: req.recipient,
      deliveryman: req.deliveryman,
    });

    return res.json({
      id: delivery.id,
      product: delivery.product,
      recipient_id: delivery.recipient_id,
      recipient: req.recipient,
      address_id: delivery.address_id,
      address: req.address,
      deliveryman_id: delivery.deliveryman_id,
      deliveryman: req.deliveryman,
    });
  }

  async update(req, res) {
    if (req.deliveryExists.canceled_at) {
      return res
        .status(400)
        .json({ error: 'You can not update a canceled delivery' });
    }

    if (req.body.canceled_at) {
      return res
        .status(401)
        .json({ error: 'You cannot cancel a delivery by this route' });
    }

    await req.deliveryExists.update(req.body);

    return res.json({
      id: req.deliveryExists.id,
      product: req.deliveryExists.product,
      recipient_id: req.deliveryExists.recipient_id,
      recipient: req.recipient,
      address_id: req.deliveryExists.address_id,
      address: req.address,
      deliveryman_id: req.deliveryExists.deliveryman_id,
      deliveryman: req.deliveryman,
    });
  }

  async destroy(req, res) {
    await req.deliveryExists.update({ canceled_at: new Date() });
    return res.json(req.deliveryExists);
  }
}

export default new DeliveryController();
