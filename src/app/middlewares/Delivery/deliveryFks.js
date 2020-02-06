import Recipient from '../../models/Recipient';
import Deliveryman from '../../models/Deliveryman';
import Address from '../../models/Address';

export default async (req, res, next) => {
  if (req.body.deliveryman_id) {
    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    req.deliveryman = deliverymanExists;
  }

  if (req.body.recipient_id) {
    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    req.recipient = recipientExists;
  }

  if (req.body.address_id) {
    const addressExists = await Address.findByPk(req.body.address_id);

    if (!addressExists) {
      return res.status(400).json({ error: 'Address not found' });
    }

    if (addressExists.recipient_id !== req.recipient.id) {
      return res
        .status(400)
        .json({ error: 'Address does not belong to recipient' });
    }

    req.address = addressExists;
  }

  return next();
};
