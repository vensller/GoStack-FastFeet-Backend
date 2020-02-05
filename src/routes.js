import { Router } from 'express';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import AddressController from './app/controllers/AddressController';

// Auth middlewares
import authMiddleware from './app/middlewares/Auth/auth';

// Recipient middlewares
import recipientValidation from './app/middlewares/Recipient/recipientValidation';
import recipientIDMiddleware from './app/middlewares/Recipient/recipientId';

// Address middlewares
import addressValidation from './app/middlewares/Address/addressValidation';
import addressIdMiddleware from './app/middlewares/Address/addressId';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', recipientValidation, RecipientController.store);
routes.put(
  '/recipients/:id',
  recipientIDMiddleware,
  recipientValidation,
  RecipientController.update
);
routes.delete(
  '/recipients/:id',
  recipientIDMiddleware,
  RecipientController.destroy
);

routes.get('/addresses', AddressController.index);
routes.post('/addresses', addressValidation, AddressController.store);
routes.put('/addresses/:id', addressIdMiddleware, AddressController.update);
routes.delete('/addresses/:id', addressIdMiddleware, AddressController.destroy);

export default routes;
