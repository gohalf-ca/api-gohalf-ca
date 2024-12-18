import { Router } from 'express';
import { health_check } from './handlers/health_check.js';
import { create_trip, delete_trip, get_trip_by_id, update_trip, getalltrips, join_trip } from './handlers/trips.js';
import { get_user_id } from './services/users.js';
import { create_expense, get_expenses, delete_expense, mark_expense_as_paid } from './handlers/expenses.js';
import { requireAuth } from '@clerk/express';


const routes = Router();

//  INFO: Health Check
routes.get('/health_check', health_check);

//  INFO: trips
routes.post('/trips/:code/join', requireAuth(), join_trip);
routes.route('/trips').get().post(create_trip);
routes.route('/trips/:trip_id').get(get_trip_by_id).put(update_trip).delete(delete_trip);
routes.route('/alltrips/:clerk_id').get(getalltrips);

// INFO: Get user ID
routes.get('/getuserid/:clerk_id', get_user_id);

// expenses
routes.route('/expenses').post(requireAuth(), create_expense);  //Create Expense
routes.route('/expenses/:trip_id').get(get_expenses);      //Get trip expenses
routes.route('/expenses/:expense_id').delete(delete_expense);   //Delete expense
routes.put('/expenses/:expense_id/mark-as-paid', requireAuth(), mark_expense_as_paid);  //Update Expense

export default routes;
