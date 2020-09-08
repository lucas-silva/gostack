import { Router } from 'express';

import Multer from 'multer';
import MulterConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';
import PackageController from './app/controllers/PackageController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import AuthMiddleware from './app/middlewares/auth';
import AuthProviderMiddleware from './app/middlewares/authProvider';

const routes = new Router();
const upload = new Multer(MulterConfig);

routes.get('/', (req, res) => res.send('ok'));

routes.post('/session', SessionController.store);

routes.post('/users', UserController.store);
routes.put('/users', AuthMiddleware, UserController.update);

routes.get('/recipients', AuthProviderMiddleware, RecipientController.index);
routes.get('/recipients/:id', AuthProviderMiddleware, RecipientController.show);
routes.post('/recipients', AuthProviderMiddleware, RecipientController.store);
routes.put(
  '/recipients/:id',
  AuthProviderMiddleware,
  RecipientController.update
);
routes.delete(
  '/recipients/:id',
  AuthProviderMiddleware,
  RecipientController.delete
);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/providers', AuthMiddleware, ProviderController.index);

routes.get('/appointments', AuthMiddleware, AppointmentController.index);
routes.post('/appointments', AuthMiddleware, AppointmentController.store);
routes.delete(
  '/appointments/:id',
  AuthMiddleware,
  AppointmentController.delete
);

routes.get(
  '/notifications',
  AuthProviderMiddleware,
  NotificationController.index
);

routes.put(
  '/notifications/:id',
  AuthProviderMiddleware,
  NotificationController.update
);

routes.get('/schedule', AuthMiddleware, ScheduleController.index);

routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/couriers', AuthMiddleware, CourierController.index);
routes.get('/couriers/:id', AuthMiddleware, CourierController.show);
routes.post('/couriers', AuthMiddleware, CourierController.store);
routes.put('/couriers/:id', AuthMiddleware, CourierController.update);
routes.delete('/couriers/:id', AuthMiddleware, CourierController.delete);

routes.get('/packages', AuthMiddleware, PackageController.index);
routes.get('/packages/:id', AuthMiddleware, PackageController.show);
routes.post('/packages', AuthMiddleware, PackageController.store);
routes.put('/packages/:id', AuthMiddleware, PackageController.update);
routes.delete('/packages/:id', AuthMiddleware, PackageController.delete);

export default routes;
