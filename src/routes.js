import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import AddressController from './app/controllers/AddressController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanPackagesController from './app/controllers/DeliverymanPackagesController';
import PickupPackageController from './app/controllers/PickupPackageController';
import DeliverPackageController from './app/controllers/DeliverPackageController';

// Auth middlewares
import authMiddleware from './app/middlewares/Auth/auth';

// Recipient middlewares
import recipientValidation from './app/middlewares/Recipient/recipientValidation';
import recipientIDMiddleware from './app/middlewares/Recipient/recipientId';

// Address middlewares
import addressValidation from './app/middlewares/Address/addressValidation';
import addressIdMiddleware from './app/middlewares/Address/addressId';

// Deliveryman middlewares
import deliverymanId from './app/middlewares/Deliveryman/deliverymanId';
import deliverymanValidation from './app/middlewares/Deliveryman/deliverymanValidation';

// Delivery middlewares
import deliveryId from './app/middlewares/Delivery/deliveryId';
import deliveryFields from './app/middlewares/Delivery/deliveryFields';
import deliveryFks from './app/middlewares/Delivery/deliveryFks';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Show Deliveries of Deliveryman
routes.get('/deliveries/:deliveryman_id', DeliveryController.index);

// Show Finished Deliveries of Deliveryman
routes.get(
  '/deliveryman/:deliveryman_id/deliveries',
  DeliverymanPackagesController.index
);

// Pickup package
routes.put(
  '/delivery/:delivery_id/pickup/:deliveryman_id',
  PickupPackageController.update
);

// Deliver package
routes.put(
  '/delivery/:delivery_id/deliver/:deliveryman_id',
  DeliverPackageController.update
);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Recipient routes
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

// Address routes
routes.get('/addresses', AddressController.index);
routes.post('/addresses', addressValidation, AddressController.store);
routes.put('/addresses/:id', addressIdMiddleware, AddressController.update);
routes.delete('/addresses/:id', addressIdMiddleware, AddressController.destroy);

// Upload file route
routes.post('/files', upload.single('file'), FileController.store);

// Deliveryman routes
routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', deliverymanValidation, DeliverymanController.store);
routes.put('/deliverymen/:id', deliverymanId, DeliverymanController.update);
routes.delete('/deliverymen/:id', deliverymanId, DeliverymanController.destroy);

// Delivery routes
routes.post(
  '/deliveries',
  deliveryFields,
  deliveryFks,
  DeliveryController.store
);
routes.put(
  '/deliveries/:id',
  deliveryId,
  deliveryFields,
  deliveryFks,
  DeliveryController.update
);
routes.delete('/deliveries/:id', deliveryId, DeliveryController.destroy);

export default routes;
