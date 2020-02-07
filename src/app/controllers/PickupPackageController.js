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
import Deliveryman from '../models/Deliveryman';

class PickupPackageController {
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    if (delivery.deliveryman_id !== deliveryman.id) {
      return res
        .status(400)
        .json({ error: 'This package does not belongs to the delivery' });
    }

    if (delivery.start_date !== null) {
      return res.status(400).json({ error: 'This package was already picked' });
    }

    if (delivery.end_date !== null) {
      return res
        .status(400)
        .json({ error: 'This package was already delivered' });
    }

    const actualDate = new Date();
    const initDate = setSeconds(setMinutes(setHours(actualDate, 8), 0), 0);
    const endDate = setSeconds(setMinutes(setHours(actualDate, 18), 0), 0);

    if (isBefore(actualDate, initDate) || isAfter(actualDate, endDate)) {
      return res
        .status(401)
        .json({ error: 'You can only pickup packages from 08:00 to 18:00' });
    }

    const todayDeliveries = await Delivery.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(actualDate), endOfDay(actualDate)],
        },
        deliveryman_id: deliveryman.id,
      },
    });

    if (todayDeliveries.length >= 5) {
      return res
        .status(401)
        .json({ error: 'This delivery already picked up 5 packages today' });
    }

    await delivery.update({ start_date: actualDate });

    return res.json(delivery);
  }
}

export default new PickupPackageController();
