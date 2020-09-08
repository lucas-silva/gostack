import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancelllationMail {
  get key() {
    return 'CancelllationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    const formattedDate = format(
      parseISO(appointment.date),
      "'Dia' dd 'de' MMMM 'às' H:mm'h'",
      {
        locale: pt,
      }
    );

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: formattedDate,
      },
    });
  }
}

export default new CancelllationMail();
