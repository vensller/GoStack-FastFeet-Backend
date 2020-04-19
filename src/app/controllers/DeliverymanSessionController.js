import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    const user = await Deliveryman.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const { name, email, createdAt, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        createdAt,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
