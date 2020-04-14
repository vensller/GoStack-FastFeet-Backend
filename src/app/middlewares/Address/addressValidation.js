import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    street: Yup.string().required(),
    house_number: Yup.number().required(),
    complement: Yup.string(),
    state: Yup.string().required(),
    city: Yup.string().required(),
    zip_code: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails!' });
  }

  return next();
};
