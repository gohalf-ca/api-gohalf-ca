import { connect_to_db } from '../../database/database.js';

/**
 * Creates an expense and associated subexpenses for a trip
 * @param {Object} createExpenseCommand - The command to create an expense
 * @param {string} createExpenseCommand.trip_id - The id of the trip
 * @param {string} createExpenseCommand.user_id - The id of the user creating the expense
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
        const getGroupMembersSql = `
            SELECT user_id
            FROM user_trips
            WHERE trip_id = $1 AND user_id != $2;
        `;
        const groupMembersResult = await db.query(getGroupMembersSql, [
            createExpenseCommand.trip_id,
            createExpenseCommand.user_id,
        ]);

        // Calculate subexpense amount (equal split among members)
        const memberCount = groupMembersResult.rows.length;
        const subexpenseAmount = Math.floor(createExpenseCommand.amount / (memberCount + 1));

        // Create subexpenses for each group member
        const createSubexpenseSql = `
            INSERT INTO subexpenses (expense_id, user_id, amount)
            VALUES ($1, $2, $3);
        `;

        const subexpensePromises = groupMembersResult.rows.map(member =>
            db.query(createSubexpenseSql, [
                createdExpense.expense_id,
                member.user_id,
                subexpenseAmount
            ])
        );

        // Add the creator's subexpense (if there are other members)
        if (memberCount > 0) {
            subexpensePromises.push(
                db.query(createSubexpenseSql, [
                    createdExpense.expense_id,
                    createExpenseCommand.user_id,
                    createExpenseCommand.amount - (subexpenseAmount * memberCount)
                ])
            );
        }

        // Execute all subexpense insertions
        await Promise.all(subexpensePromises);

        // Commit the transaction
        await db.query('COMMIT');

        return createdExpense;
    } catch (error) {
        // Rollback the transaction on any error
        await db.query('ROLLBACK');

        // Log the error and rethrow
        console.error('Expense creation failed:', error);
        throw error;
    } finally {
        // Ensure database connection is closed
        // if (db.end) {
        //     await db.end();
        // }
    }
};

//Get all expenses for a certain trip
export const getAllExpenses = async (trip_id) => {
    try{
        const db = await connect_to_db();   //db connection

        //sql insert command
        const sql = `
        SELECT * FROM EXPENSES
        WHERE trip_id = $1`


        const result = await db.query(sql, [trip_id])
        return result.rows;
    }catch (err){
        console.log("Error Occured during geting all expenses of a trip, error is: \n" + err)
        return err;
    }
}