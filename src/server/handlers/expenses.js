import * as expense_service from '../services/expenses.js'

/** create expense
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const create_expense = async (req, res) => {
    try {
        const create_expense_command = {
            trip_id: req.body.trip_id,
            user_id: req.auth.sessionClaims.user_external_id,
            name: req.body.name,
            description: req.body.description,
            amount: req.body.amount
        };
        let result = await expense_service.create_expense(create_expense_command);
        res.status(201).json({ message: 'Expense created', trip_id: result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create expense', message: err.message });
    }
}
