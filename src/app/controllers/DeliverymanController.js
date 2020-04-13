import Sequelize from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    return res.json(
      await Deliveryman.findAll({
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
        where: {
          name: {
            [Sequelize.Op.iLike]: `%${req.query.name ? req.query.name : ''}%`,
          },
        },
      })
    );
  }

  async store(req, res) {
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'E-mail already in use' });
    }

    if (req.body.avatar_id) {
      const avatarExists = await File.findByPk(req.body.avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'Avatar not found' });
      }
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    if (req.body.email) {
      const deliveryWithEmail = await Deliveryman.findOne({
        where: { email: req.body.email },
      });

      if (deliveryWithEmail) {
        return res.status(400).json({ error: 'E-mail already in use' });
      }
    }

    if (req.body.avatar_id) {
      const avatarExists = await File.findByPk(req.body.avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'Avatar not found' });
      }
    }

    await req.deliverymanExists.update(req.body);

    return res.json(req.deliverymanExists);
  }

  async destroy(req, res) {
    await req.deliverymanExists.destroy();

    return res.json(req.deliverymanExists);
  }
}

export default new DeliverymanController();
