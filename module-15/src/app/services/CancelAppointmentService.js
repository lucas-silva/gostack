import { subHours } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class CancelAppointmentService {
  async run({ appointment_id, user_id }) {
    const appointment = await Appointment.findByPk(appointment_id, {
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
      throw new Error('Appointment does not exists');
    }

    const allowed = appointment.user_id === user_id;

    if (!allowed) {
      throw new Error(
        "You don't have permission to delete other user appointment"
      );
    }

    const dateWithSub = subHours(appointment.date, 2);
    const cantDelete = dateWithSub < new Date();

    if (cantDelete) {
      throw new Error('You can only cancel appointments 2 hours in advance.');
    }

    appointment.cancelled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return appointment;
  }
}

export default new CancelAppointmentService();
