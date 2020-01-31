import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';
import recipientStoreMiddleware from './app/middlewares/recipientStore';
import recipientUpdMiddleware from './app/middlewares/recipientUpdate';
import recipientIDMiddleware from './app/middlewares/recipientId';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', recipientStoreMiddleware, RecipientController.store);
routes.put(
  '/recipients/:id',
  recipientIDMiddleware,
  recipientUpdMiddleware,
  RecipientController.update
);
routes.delete(
  '/recipients/:id',
  recipientIDMiddleware,
  RecipientController.destroy
);

export default routes;
