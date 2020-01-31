import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import Address from '../models/Address';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    address_id: Yup.number(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails!' });
  }

  const recipientExists = await Recipient.findOne({
    where: { name: req.body.name },
  });

  if (recipientExists) {
    return res.status(400).json({ error: 'Recipient found with name' });
  }

  if (req.body.address_id) {
    const addressExists = await Address.findByPk(req.body.address_id);

    if (!addressExists) {
      return res.status(400).json({ error: 'Address not found!' });
    }
  }

  return next();
};
