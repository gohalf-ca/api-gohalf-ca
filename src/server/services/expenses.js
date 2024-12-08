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
    console.log("createExpenseCommand", createExpenseCommand);

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
        console.log("createdExpense", createdExpense);

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
        console.log("groupMembersResult", groupMembersResult.rows);

        // Calculate subexpense amount (equal split among members)
        const memberCount = groupMembersResult.rows.length;
        const splitAmount = Math.floor(createExpenseCommand.amount / (memberCount + 1));

        // Create subexpenses for each group member
        const createExpenseSplitsSql = `
            INSERT INTO expense_splits (expense_id, user_id, amount)
            VALUES ($1, $2, $3);
        `;

        const subexpensePromises = groupMembersResult.rows.map(member =>
            db.query(createExpenseSplitsSql, [
                createdExpense.expense_id,
                member.user_id,
                splitAmount
            ])
        );

        // Add the creator's subexpense (if there are other members)
        // if (memberCount > 0) {
        //     const split = createExpenseCommand.amount - (splitAmount * memberCount);
        //     subexpensePromises.push(
        //         db.query(createExpenseSplitsSql, [
        //             createdExpense.expense_id,
        //             createExpenseCommand.user_id,
        //             split
        //         ])
        //     );
        // }

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
