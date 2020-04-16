import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanPackagesController from './app/controllers/DeliverymanPackagesController';
import PickupPackageController from './app/controllers/PickupPackageController';
import DeliverPackageController from './app/controllers/DeliverPackageController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblematicPackagesController from './app/controllers/ProblematicPackagesController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

// Auth middlewares
import authMiddleware from './app/middlewares/Auth/auth';

// Recipient middlewares
import recipientValidation from './app/middlewares/Recipient/recipientValidation';
import recipientIDMiddleware from './app/middlewares/Recipient/recipientId';

// Address middlewares
import addressValidation from './app/middlewares/Address/addressValidation';

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

// Delivery problems
routes.get('/delivery/:delivery_id/problems', DeliveryProblemController.index);
routes.post('/delivery/:delivery_id/problems', DeliveryProblemController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Recipient routes
routes.get('/recipients', RecipientController.index);
routes.post(
  '/recipients',
  recipientValidation,
  addressValidation,
  RecipientController.store
);
routes.put(
  '/recipients/:id',
  recipientIDMiddleware,
  recipientValidation,
  addressValidation,
  RecipientController.update
);
routes.delete(
  '/recipients/:id',
  recipientIDMiddleware,
  RecipientController.destroy
);

// Upload file route
routes.post('/files', upload.single('file'), FileController.store);

// Deliveryman routes
routes.get('/couriers', DeliverymanController.index);
routes.post('/couriers', deliverymanValidation, DeliverymanController.store);
routes.put('/couriers/:id', deliverymanId, DeliverymanController.update);
routes.delete('/couriers/:id', deliverymanId, DeliverymanController.destroy);

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

// Problematic packages
routes.get('/problems/deliveries', ProblematicPackagesController.index);

// Cancel delivery
routes.delete(
  '/problem/:problem_id/cancel-delivery',
  CancelDeliveryController.destroy
);

export default routes;
