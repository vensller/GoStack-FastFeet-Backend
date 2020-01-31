import Recipient from '../models/Recipient';
import Address from '../models/Address';
import Database from '../../database/index';

class RecipientController {
  async index(req, res) {
    return res.json(await Recipient.findAll());
  }

  async store(req, res) {
    const {
      name,
      street,
      house_number,
      complement,
      state,
      city,
      cep,
    } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists!' });
    }

    let addressExists = await Address.findOne({
      where: { street, house_number, state, city },
    });

    const transaction = await Database.startTransaction();
    try {
      if (!addressExists) {
        addressExists = await Address.create(
          {
            street,
            house_number,
            complement,
            state,
            city,
            cep,
          },
          { transaction }
        );
      }

      const { id } = await Recipient.create(
        {
          name,
          address_id: addressExists.id,
        },
        { transaction }
      );

      await transaction.commit();
      return res.json({
        id,
        name,
        address: {
          id: addressExists.id,
          street,
          house_number,
          complement,
          state,
          city,
          cep,
        },
      });
    } catch (error) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ error: 'The service was unable to register a new Recipient' });
    }
  }

  async update(req, res) {
    const recipientExists = await Recipient.findByPk(req.params.id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found!' });
    }

    const recipient = await recipientExists.update(req.body);

    return res.json(recipient);
  }

  async destroy(req, res) {
    const recipientExists = await Recipient.findByPk(req.params.id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found!' });
    }

    await recipientExists.destroy();

    return res.json(recipientExists);
  }
}

export default new RecipientController();
