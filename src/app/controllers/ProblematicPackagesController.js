import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class ProblematicPackagesController {
  async index(req, res) {
    return res.json(
      await Delivery.findAll({
        include: [
          {
            model: DeliveryProblem,
            required: true,
            attributes: ['id', 'description'],
          },
        ],
        attributes: ['id', 'product'],
      })
    );
  }
}

export default new ProblematicPackagesController();
