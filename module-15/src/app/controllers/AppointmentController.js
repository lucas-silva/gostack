import { subHours } from 'date-fns';

import Appointment from '../models/Appointment';

import User from '../models/User';
import File from '../models/File';
import CreateAppointmentService from '../services/CreateAppointmentService';

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
    const data = { ...req.body, user_id: req.userId };

    const appointment = await CreateAppointmentService.run(data);

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
