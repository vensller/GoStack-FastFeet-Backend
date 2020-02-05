import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import AddressController from './app/controllers/AddressController';
import FileController from './app/controllers/FileController';

// Auth middlewares
import authMiddleware from './app/middlewares/Auth/auth';

// Recipient middlewares
import recipientValidation from './app/middlewares/Recipient/recipientValidation';
import recipientIDMiddleware from './app/middlewares/Recipient/recipientId';

// Address middlewares
import addressValidation from './app/middlewares/Address/addressValidation';
import addressIdMiddleware from './app/middlewares/Address/addressId';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
