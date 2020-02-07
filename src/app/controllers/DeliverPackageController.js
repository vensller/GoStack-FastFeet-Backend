import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryPackageController {
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.deliveryman_id !== Number(req.params.deliveryman_id)) {
      return res
        .status(400)
        .json({ error: 'This package does not belongs to this deliveryman' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'This packages was not picked' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'This package was already delivered' });
    }

    if (!req.body.signature_id) {
      return res.status(400).json({ error: 'Signature was not provided' });
    }

    const signature = await File.findByPk(req.body.signature_id);

    if (!signature) {
      return res.status(400).json({ error: 'Signature not found' });
    }

    await delivery.update({
      end_date: new Date(),
      signature_id: req.body.signature_id,
    });

    return res.json(delivery);
  }
}

export default new DeliveryPackageController();
