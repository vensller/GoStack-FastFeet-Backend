import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery, recipient, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancelDelivery',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product: delivery.product,
      },
    });
  }
}

export default new CancellationMail();
