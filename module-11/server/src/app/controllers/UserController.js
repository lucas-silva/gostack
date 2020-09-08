import User from '../models/User';

class UserController {
  async store(req, res) {
    if (req.body.email === 'hacker@google.com') {
      return res.status(400).json({ error: 'We gotcha you' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }
}

export default new UserController();
