import { Router } from 'express';
import { health_check } from './handlers/health_check.js';
import { create_trip, delete_trip, get_trip_by_id, update_trip, getalltrips } from './handlers/trips.js';
import { get_user_id } from './services/users.js';

const routes = Router();

//  INFO: Health Check
routes.get('/health_check', health_check);

//  INFO: trips
routes.route('/trips').get().post(create_trip);
routes.route('/trips/:trip_id').get(get_trip_by_id).put(update_trip).delete(delete_trip);
routes.route('/alltrips/:clerk_id').get(getalltrips);

// INFO: Get user ID
routes.get('/getuserid/:clerk_id', get_user_id);


export default routes;
