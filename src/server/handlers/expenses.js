import * as expense_service from '../services/expenses.js'

/** create expense
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const create_expense = async (req, res) => {
    const trip_id = typeof req.body.trip_id === 'string' ? parseInt(req.body.trip_id) : req.body.trip_id;
    const user_id = req.auth?.sessionClaims?.user_external_id ?? req.body.user_id;
    try {
        const create_expense_command = {
            trip_id: trip_id,
            user_id: typeof user_id === 'string' ? parseInt(user_id) : user_id,
            name: req.body.name,
            description: req.body.description,
            amount: typeof req.body.amount === 'string' ? parseInt(req.body.amount) : req.body.amount
        };
        let result = await expense_service.createExpense(create_expense_command);
        res.status(201).json({ message: 'Expense created', trip_id: result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create expense', message: err.message });
    }
}


export const get_trip_expenses = async (req, res) => {
    const tripID = req.params.trip_id;

    try {
        const result = await expense_service.getAllExpenses(tripID);    //Call function to get object with all expenses
        res.status(201).json({ response: true, data: result })
    } catch (err) {
        res.status(500).json({ error: 'Failed to get all expenses', message: err.message })
    }

}


export const delete_expense = async (req, res) => {
    const expenseID = req.params.expense_id

    try {
        console.log("awddaw")
        await expense_service.deleteExpense(expenseID)
        res.status(201).json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get all expenses', message: err.message })
    }

}
