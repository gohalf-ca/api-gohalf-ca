import { connect_to_db } from '../../database/database.js';

/** create trip
 * @param {string} owner_id - The owner_id of the user.
 * @param {string} trip_name - The name of the trip.
 * @param {string} trip_desc - The description of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const create_trip = async (owner_id, trip_name, trip_desc) => {
    try {
        const db = await connect_to_db();
        // generate unique code
        const code = Math.random().toString(36).substring(2, 8);
        const sql = `
            INSERT INTO trips (owner_id, name, description, code)
            VALUES ($1, $2, $3, $4)
            RETURNING trip_id;
        `;
        const result = await db.query(sql, [owner_id, trip_name, trip_desc, code]);
        return result.rows[0].trip_id;
    } catch (err) {
        console.error("Failed to create ", err.message);
        return err;
    }
}

/** get trip
 * @param {string} trip_id - The id of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const get_trip_by_id = async (trip_id) => {
    try {
        const db = await connect_to_db();
        const sql = `
            SELECT * FROM trips
            WHERE trip_id = $1;
        `;
        const result = await db.query(sql, [trip_id]);
        return result.rows[0];
    } catch (err) {
        console.error("Failed to get trip by id", err.message);
        return err;
    }
}

/** update trip
 * @param {string} trip_id - The id of the trip.
 * @param {string} owner_id - The owner_id of the user.
 * @param {string} trip_name - The name of the trip.
 * @param {string} trip_desc - The description of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const update_trip = async (trip_id, owner_id, trip_name, trip_desc) => {
    try {
        const db = await connect_to_db();
        const sql = `
            UPDATE trips
            SET owner_id = COALESCE($2, owner_id),
                name = COALESCE($3, name),
                description = COALESCE($4, description)
            WHERE trip_id = $1;
        `;
        void db.query(sql, [trip_id, owner_id, trip_name, trip_desc]);
    } catch (err) {
        console.error("Failed to create ", err.message);
        return err;
    }
}

/** delete trip
 * @param {string} trip_id - The id of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const delete_trip = async (trip_id) => {
    try {
        const db = await connect_to_db();
        const sql = `
            DELETE FROM trips
            WHERE trip_id = $1;
        `;
        void db.query(sql, [trip_id]);
    } catch (err) {
        console.error("Failed to delete trip", err.message);
        return err;
    }
}



//getting all trips of user
export const getalltrips = async (clerk_id) => {
    try{
        const db = await connect_to_db();
        const sql = `
            select t.* from trips t
            join users u
            on owner_id = user_id
            where u.clerk_id = $1;
        `;
        const result = await db.query(sql, [clerk_id]);
        return result.rows;

    }catch(err){
        console.log(err);
        return err;
    }
}