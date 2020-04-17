import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class ProblematicPackagesController {
  async index(req, res) {
    let offset = 0;

    if (req.query.count && req.query.page) {
      offset = req.query.count * req.query.page - req.query.count;
    }

    return res.json(
      await DeliveryProblem.findAll({
        include: [
          {
            model: Delivery,
            as: 'delivery',
            required: true,
            attributes: ['id'],
            where: {
              canceled_at: null,
            },
          },
        ],
        attributes: ['id', 'description'],
        order: [[{ model: Delivery, as: 'delivery' }, 'id', 'asc']],
        limit: req.query.count,
        offset,
      })
    );
  }
}

export default new ProblematicPackagesController();
