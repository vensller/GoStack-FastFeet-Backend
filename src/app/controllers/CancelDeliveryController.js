import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import DeliveryProblem from '../models/DeliveryProblem';
import Queue from '../../lib/Queue';
import CancelDelivery from '../jobs/CancelDelivery';

class CancelDeliveryController {
  async destroy(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.problem_id, {
      include: [
        {
          model: Delivery,
          as: 'delivery',
          required: true,
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
              required: true,
            },
            {
              model: Recipient,
              as: 'recipient',
              required: true,
            },
          ],
        },
      ],
    });

    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    if (problem.delivery.canceled_at) {
      return res.status(400).json({ error: 'This delivery was canceled' });
    }

    if (problem.delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'This package was already delivered' });
    }

    if (!problem.delivery.start_date) {
      return res.status(400).json({ error: 'This packages was not picked up' });
    }

    await Queue.add(CancelDelivery.key, {
      delivery: problem.delivery,
      recipient: problem.delivery.recipient,
      deliveryman: problem.delivery.deliveryman,
    });

    await problem.delivery.update({ canceled_at: new Date() });

    return res.json(problem);
  }
}

export default new CancelDeliveryController();
