import Recipient from '../../models/Recipient';

export default async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Recipient ID not found!' });
  }

  const recipientExists = await Recipient.findByPk(req.params.id);

  if (!recipientExists) {
    return res.status(400).json({ error: 'Recipient not found!' });
  }

  req.recipientExists = recipientExists;
  req.recipientId = req.params.id;

  return next();
};
