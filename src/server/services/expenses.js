import { connect_to_db } from '../../database/database.js';


/** create expense 
 * @param {object} create_expense_command - The command to create an expense.
 * @param {string} create_expense_command.trip_id - The id of the trip.
 * @param {string} create_expense_command.user_id - The id of the user creating the expense.
 * @param {string} create_expense_command.name - The name of the expense.
 * @param {string} create_expense_command.description - The description of the expense.
 * @param {string} create_expense_command.amount - The amount of the expense (in cents).
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const create_expense = async (create_expense_command) => {
    const db = await connect_to_db();
    try {
        await db.query('BEGIN');
        const create_expense_sql = `
            INSERT INTO expenses (trip_id, created_by, name, amount, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const expense = await db.query(create_expense_sql, [
            create_expense_command.trip_id,
            create_expense_command.user_id,
            create_expense_command.name,
            create_expense_command.amount,
            create_expense_command.description,
        ]);
        if (expense.rows.length === 0) {
            throw new Error('Failed to create expense');
        }
        // Get group members except the creator
        const get_group_members_sql = `
            SELECT user_id
            FROM trips
            WHERE trip_id = $1
            AND user_id != $2;
        `;
        const group_members = await db.query(get_group_members_sql, [
            create_expense_command.trip_id,
            create_expense_command.user_id,
        ]);
        if (group_members.rows.length === 0) {
            throw new Error('Failed to get group members');
        }
        // Create subexpense for each group member except the creator
        const create_subexpense_sql = `
            INSERT INTO subexpenses (expense_id, user_id, amount)
            VALUES ($1, $2, $3);
        `;
        // use Promise.all to create all subexpenses in parallel
        const subexpenses_promises = group_members.rows.map(async (member) => {
            await db.query(create_subexpense_sql, [
                expense.rows[0].expense_id,
                member.user_id,
                create_expense_command.amount / group_members.rows.length,
            ]);
        });
        await Promise.all(subexpenses_promises);

        await db.query('COMMIT');
    } catch (err) {
        await db.query('ROLLBACK');
        console.error("Failed to create ", err.message);
        return err;
    }
}
