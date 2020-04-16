import Sequelize from 'sequelize';
import Recipient from '../models/Recipient';
import Address from '../models/Address';
import Database from '../../database/index';

class RecipientController {
  async index(req, res) {
    let offset = 0;

    if (req.query.count && req.query.page) {
      offset = req.query.count * req.query.page - req.query.count;
    }

    return res.json(
      await Recipient.findAll({
        where: {
          name: {
            [Sequelize.Op.iLike]: `%${req.query.name ? req.query.name : ''}%`,
          },
        },
        order: ['id'],
        include: [
          {
            model: Address,
            as: 'address',
          },
        ],
        limit: req.query.count,
        offset,
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
    const recipientWithNewName = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientWithNewName) {
      return res
        .status(400)
        .json({ error: 'Já existe um destinatário cadastrado com esse nome' });
    }

    if (!req.body.address_id) {
      return res.status(400).json({ error: 'Endereço não foi informado' });
    }

    const addressExists = await Address.findByPk(req.body.address_id);

    if (!addressExists) {
      return res.status(400).json({ error: 'Endereço  inexistente' });
    }

    const transaction = await Database.connection.transaction();

    try {
      const { id, name } = await req.recipientExists.update(req.body, {
        transaction,
      });

      const {
        street,
        house_number,
        complement,
        zip_code,
        city,
        state,
      } = await addressExists.update(req.body, { transaction });

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
      transaction.rollback();
      return res.json({ error: 'Não foi possível salvar o destinatário' });
    }
  }

  async destroy(req, res) {
    await req.recipientExists.destroy();

    return res.json(req.recipientExists);
  }
}

export default new RecipientController();
