import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const { date } = req.query;

    const parsedDate = parseISO(date);
    const min = startOfDay(parsedDate);
    const max = endOfDay(parsedDate);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        cancelled_at: null,
        date: {
          [Op.between]: [min, max],
        },
      },
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
