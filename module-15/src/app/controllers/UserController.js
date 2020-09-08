import * as Yup from 'yup';
import User from '../models/User';

import Cache from '../../lib/Cache';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    if (provider) {
      await Cache.invalidate('providers');
    }

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword) {
      const passwordMatch = await user.checkPassword(oldPassword);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password does not match' });
      }
    }

    const { id, name, provider } = await user.update(req.body);

    if (provider) {
      await Cache.invalidate('providers');
    }

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
