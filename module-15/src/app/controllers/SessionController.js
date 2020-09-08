import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import auth from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    });

    const schemaValid = await schema.isValid(req.body);

    if (!schemaValid) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, auth.key, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
