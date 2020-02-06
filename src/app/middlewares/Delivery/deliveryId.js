import Delivery from '../../models/Delivery';

export default async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Delivery ID not found!' });
  }

  const deliveryExists = await Delivery.findByPk(req.params.id);

  if (!deliveryExists) {
    return res.status(400).json({ error: 'Delivery not found!' });
  }

  req.deliveryExists = deliveryExists;

  return next();
};
