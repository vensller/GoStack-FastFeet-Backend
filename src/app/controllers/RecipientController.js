import Sequelize from 'sequelize';
import Recipient from '../models/Recipient';

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
    const { name } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists!' });
    }

    const { id } = await Recipient.create(req.body);

    return res.json({ id, name });
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
