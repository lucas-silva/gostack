import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!provider) {
      throw new Error('You can only create appointments with providers');
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not allowed');
    }

    const appointmentInSameTime = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart,
      },
    });

    if (appointmentInSameTime) {
      throw new Error('Appointment date is not available');
    }

    const data = { provider_id, date: hourStart, user_id };
    const appointment = await Appointment.create(data);

    const currentUser = await User.findByPk(user_id);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM 'às' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${currentUser.name} para ${formattedDate}`,
      user: provider_id,
    });

    return appointment;
  }
}

export default new CreateAppointmentService();
