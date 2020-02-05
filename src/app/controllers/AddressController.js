import Address from '../models/Address';
import Recipient from '../models/Recipient';

class AddressController {
  async index(req, res) {
    if (!req.query.recipient_id) {
      return res.status(400).json({ error: 'Recipient not provided' });
    }

    const addresses = await Address.findAll({
      where: { recipient_id: req.query.recipient_id },
    });

    return res.json(addresses);
  }

  async store(req, res) {
    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const address = await Address.create(req.body);

    return res.json(address);
  }

  async update(req, res) {
    if (req.body.recipient_id) {
      const recipientExists = await Recipient.findByPk(req.body.recipient_id);

      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient not found' });
      }
    }

    await req.addressExists.update(req.body);

    return res.json(req.addressExists);
  }

  async destroy(req, res) {
    await req.addressExists.delete();

    return res.json(req.addressExists);
  }
}

export default new AddressController();
