import { Router } from 'express';
import { health_check } from './handlers/health_check.js';

const routes = Router();

//  INFO: Health Check
routes.get('/health_check', health_check);

export default routes;
