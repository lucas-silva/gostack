import pt from 'date-fns/locale/pt';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        cancelled_at: null,
      },
      limit,
      offset: (page - 1) * limit,
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancellable'],
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

  async store(req, res) {
    const { provider_id, date } = req.body;

    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!provider) {
      return res
        .status(400)
        .json({ error: 'You can only create appointments with providers' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not allowed' });
    }

    const appointmentInSameTime = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart,
      },
    });

    if (appointmentInSameTime) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const data = { ...req.body, date: hourStart, user_id: req.userId };
    const appointment = await Appointment.create(data);

    const currentUser = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM 'às' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${currentUser.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!appointment) {
      return res.status(400).json({ error: 'Appointment does not exists' });
    }

    const allowed = appointment.user_id === req.userId;

    if (!allowed) {
      return res.status(401).json({
        error: "You don't have permission to delete other user appointment",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    const canDelete = dateWithSub < new Date();

    if (!canDelete) {
      return res.status(400).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.cancelled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
