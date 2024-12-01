import { Router } from 'express';
import { health_check } from './handlers/health_check.js';
import { create_trip, delete_trip, get_trip_by_id, update_trip } from './handlers/trips.js';

const routes = Router();

//  INFO: Health Check
routes.get('/health_check', health_check);

//  INFO: trips
routes.route('/trips').get().post(create_trip);
routes.route('/trips/:trip_id').get(get_trip_by_id).put(update_trip).delete(delete_trip);

export default routes;
