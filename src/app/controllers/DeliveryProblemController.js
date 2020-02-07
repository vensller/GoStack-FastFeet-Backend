import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    return res.json(
      await DeliveryProblem.findAll({
        where: { delivery_id: req.params.delivery_id },
      })
    );
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'The package was not picked' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'The packages was already delivered' });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'The delivery was alread canceled' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: req.params.delivery_id,
      description: req.body.description,
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
