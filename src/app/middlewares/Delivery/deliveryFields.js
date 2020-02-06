import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    product: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  if (req.body.signature_id) {
    return res
      .status(400)
      .json({ error: 'You can not save signature id by this route' });
  }

  if (req.body.start_date) {
    return res
      .status(400)
      .json({ error: 'You can not save start date by this route' });
  }

  if (req.body.end_date) {
    return res
      .status(400)
      .json({ error: 'You can not save end date by this route' });
  }

  if (req.body.canceled_at) {
    return res
      .status(400)
      .json({ error: 'You can not cancel a delivery by this route' });
  }

  return next();
};
