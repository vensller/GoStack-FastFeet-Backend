import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class PickupPackageController {
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Entregador não existe' });
    }

    if (delivery.deliveryman_id !== Number(req.params.deliveryman_id)) {
      return res
        .status(400)
        .json({ error: 'Esse pacote não pertece a esse entregador' });
    }

    if (delivery.start_date) {
      return res.status(400).json({ error: 'Esse pacote já foi retirado' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Esse pacote já foi entregue' });
    }

    const actualDate = new Date();
    const initDate = setSeconds(setMinutes(setHours(actualDate, 8), 0), 0);
    const endDate = setSeconds(setMinutes(setHours(actualDate, 18), 0), 0);

    if (isBefore(actualDate, initDate) || isAfter(actualDate, endDate)) {
      return res
        .status(401)
        .json({ error: 'Você só pode fazer retiradas entre 08:00 e 18:00' });
    }

    const todayDeliveries = await Delivery.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(actualDate), endOfDay(actualDate)],
        },
        deliveryman_id: req.params.deliveryman_id,
      },
    });

    if (todayDeliveries.length >= 5) {
      return res
        .status(401)
        .json({ error: 'Esse entregador já retirou 5 encomendas hoje' });
    }

    await delivery.update({ start_date: actualDate });

    return res.json(delivery);
  }
}

export default new PickupPackageController();
