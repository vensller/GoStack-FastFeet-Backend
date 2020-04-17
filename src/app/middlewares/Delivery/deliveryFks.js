import Recipient from '../../models/Recipient';
import Deliveryman from '../../models/Deliveryman';
import Address from '../../models/Address';

export default async (req, res, next) => {
  if (req.body.deliveryman_id) {
    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    req.deliveryman = deliverymanExists;
  }

  if (req.body.recipient_id) {
    const recipientExists = await Recipient.findByPk(req.body.recipient_id, {
      include: [
        {
          model: Address,
          as: 'address',
        },
      ],
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    req.recipient = recipientExists;
  }

  return next();
};
