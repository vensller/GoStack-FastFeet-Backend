import Deliveryman from '../../models/Deliveryman';

export default async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Deliveryman ID not found!' });
  }

  const deliverymanExists = await Deliveryman.findByPk(req.params.id);

  if (!deliverymanExists) {
    return res.status(400).json({ error: 'Deliveryman not found!' });
  }

  req.deliverymanExists = deliverymanExists;

  return next();
};
