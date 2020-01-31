export default async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Recipient ID not found!' });
  }

  return next();
};
