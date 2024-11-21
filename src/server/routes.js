import { Router } from 'express';
import { health_check } from './handlers/health_check.js';
import { register } from './handlers/auth.js';

const routes = Router();

//  INFO: Health Check
routes.get('/health_check', health_check);

//  INFO: Auth
routes.post('/register', register);


export default routes;
