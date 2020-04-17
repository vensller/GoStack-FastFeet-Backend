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
    let offset = 0;

    if (req.query.count && req.query.page) {
      offset = req.query.count * req.query.page - req.query.count;
    }

    return res.json(
      await Delivery.findAll({
        where: {
          product: {
            [Sequelize.Op.iLike]: `%${
              req.query.product ? req.query.product : ''
            }%`,
          },
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
        limit: req.query.count,
        offset,
        order: ['id'],
      })
    );
  }

  async store(req, res) {
    if (!req.body.deliveryman_id || !req.body.recipient_id) {
      return res
        .status(400)
        .json({ error: 'Destinatário e entregador são necessários' });
    }

    const delivery = await Delivery.create(req.body);

    await Queue.add(DeliveryMail.key, {
      delivery,
      recipient: req.recipient,
      deliveryman: req.deliveryman,
      address: req.recipient.address,
    });

    return res.json({
      id: delivery.id,
      product: delivery.product,
      recipient_id: delivery.recipient_id,
      recipient: req.recipient,
      address_id: delivery.address_id,
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
      deliveryman_id: req.deliveryExists.deliveryman_id,
      deliveryman: req.deliveryman,
    });
  }

  async destroy(req, res) {
    await req.deliveryExists.update({ canceled_at: new Date() });
    return res.json(
      await Delivery.findByPk(req.deliveryExists.id, {
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

export default new DeliveryController();
