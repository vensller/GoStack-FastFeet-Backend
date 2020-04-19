import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryPackageController {
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    if (delivery.deliveryman_id !== Number(req.params.deliveryman_id)) {
      return res
        .status(400)
        .json({ error: 'Esse pacote não pertence a esse entregador' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Esse pacote não foi retirado' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Esse pacote já foi entregue' });
    }

    if (!req.body.signature_id) {
      return res.status(400).json({ error: 'Assinatura não informada' });
    }

    const signature = await File.findByPk(req.body.signature_id);

    if (!signature) {
      return res.status(400).json({ error: 'Assinatura não informada' });
    }

    await delivery.update({
      end_date: new Date(),
      signature_id: req.body.signature_id,
    });

    return res.json(delivery);
  }
}

export default new DeliveryPackageController();
