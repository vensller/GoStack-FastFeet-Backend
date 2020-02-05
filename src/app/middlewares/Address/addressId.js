import Address from '../../models/Address';

export default async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Address ID not found!' });
  }

  const addressExists = await Address.findByPk(req.params.id);

  if (!addressExists) {
    return res.status(400).json({ error: 'Address not found!' });
  }

  req.addressExists = addressExists;

  return next();
};
