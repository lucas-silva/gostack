import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import User from '../models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const verifyAsync = promisify(jwt.verify);
    const decoded = await verifyAsync(token, authConfig.key);

    req.userId = decoded.id;

    const user = await User.findByPk(decoded.id);
    if (!user.provider) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
