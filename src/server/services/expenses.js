import { connect_to_db } from '../../database/database.js';

/**
 * Creates an expense and associated subexpenses for a trip
 * @param {Object} createExpenseCommand - The command to create an expense
 * @param {number} createExpenseCommand.trip_id - The id of the trip
 * @param {number} createExpenseCommand.user_id - The id of the user creating the expense
 * @param {string} createExpenseCommand.name - The name of the expense
 * @param {string} createExpenseCommand.description - The description of the expense
 * @param {number} createExpenseCommand.amount - The amount of the expense (in cents)
 * @returns {Promise<Object>} The created expense
 * @throws {Error} If expense creation fails
 */
export const createExpense = async (createExpenseCommand) => {
    const db = await connect_to_db();

    try {
        // Start a database transaction
        await db.query('BEGIN');

        // Insert the main expense
        const createExpenseSql = `
            INSERT INTO expenses (trip_id, created_by, name, amount, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const expenseResult = await db.query(createExpenseSql, [
            createExpenseCommand.trip_id,
            createExpenseCommand.user_id,
            createExpenseCommand.name,
            createExpenseCommand.amount,
            createExpenseCommand?.description ?? ''
        ]);

        if (expenseResult.rows.length === 0) {
            throw new Error('Expense creation failed');
        }

        const createdExpense = expenseResult.rows[0];

        // Fetch group members, excluding the expense creator
        const get_trip_participants_sql = `
            SELECT user_id
            FROM user_trips
            WHERE trip_id = $1;
        `;
        const get_trip_participants_results = await db.query(get_trip_participants_sql, [
            createExpenseCommand.trip_id,
        ]);

        // Create trip participant as expense_participant
        const create_expense_participants_sql = `
            INSERT INTO expense_participants (expense_id, user_id, amount, is_paid)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const expense_amount_split = Math.floor(createExpenseCommand.amount / get_trip_participants_results.rows.length);
        const expense_participants = [];
        for (const p of get_trip_participants_results.rows) {
            const result = await db.query(create_expense_participants_sql, [
                createdExpense.expense_id,
                p.user_id,
                expense_amount_split,
                p.user_id === createExpenseCommand.user_id
            ]);
            expense_participants.push(result.rows[0]);
        }

        // Commit the transaction
        await db.query('COMMIT');

        return createdExpense;
    } catch (error) {
        // Rollback the transaction on any error
        await db.query('ROLLBACK');

        // Log the error and rethrow
        console.error('Expense creation failed:', error);
        throw error;
    }
};

//Get all expenses for a certain trip
export const getAllExpenses = async (trip_id) => {
    try {
        const db = await connect_to_db();   //db connection

        //sql insert command
        const sql = `
        SELECT * FROM expenses
        WHERE trip_id = $1`

        const result = await db.query(sql, [trip_id])
        return result.rows;
    } catch (err) {
        return err;
    }
}



export const deleteExpense = async (expense_id) => {
    const db = await connect_to_db();
    try {
        //  Deletes all expense splits first to aviod parent key issues
        const sql = `
            DELETE FROM expense_splits
            WHERE expense_id = $1`;
        await db.query(sql, [expense_id]);
        //  Deletes the expense itself
        const sql2 = `
        DELETE FROM expenses 
        WHERE expense_id = $1`;
        await db.query(sql2, [expense_id]);
    } catch (err) {
        return err;
    }
}
