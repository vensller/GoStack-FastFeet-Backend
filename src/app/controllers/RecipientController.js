import Sequelize from 'sequelize';
import Recipient from '../models/Recipient';
import Address from '../models/Address';
import Database from '../../database/index';

class RecipientController {
  async index(req, res) {
    return res.json(
      await Recipient.findAll({
        where: {
          name: {
            [Sequelize.Op.iLike]: `%${req.query.name ? req.query.name : ''}%`,
          },
        },
      })
    );
  }

  async store(req, res) {
    const {
      name,
      street,
      house_number,
      complement,
      zip_code,
      city,
      state,
    } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists!' });
    }

    const transaction = await Database.connection.transaction();
    try {
      const { id } = await Recipient.create(req.body, { transaction });
      await Address.create(
        {
          ...req.body,
          recipient_id: id,
        },
        { transaction }
      );

      await transaction.commit();

      return res.json({
        id,
        name,
        street,
        house_number,
        complement,
        zip_code,
        city,
        state,
      });
    } catch (error) {
      await transaction.rollback();
      return res.json({ error: 'Não foi possível salvar o destinatário' });
    }
  }

  async update(req, res) {
    if (req.recipientExists.name === req.body.name) {
      return res.json(req.recipientExists);
    }

    const recipientWithNewName = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientWithNewName) {
      return res.status(400).json({ error: 'Recipient found with name' });
    }

    const recipient = await req.recipientExists.update(req.body);

    return res.json(recipient);
  }

  async destroy(req, res) {
    await req.recipientExists.destroy();

    return res.json(req.recipientExists);
  }
}

export default new RecipientController();
