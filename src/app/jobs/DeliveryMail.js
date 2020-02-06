import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery, recipient, address, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda cadastrada',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product: delivery.product,
        address: address.full_address,
      },
    });
  }
}

export default new CancellationMail();
