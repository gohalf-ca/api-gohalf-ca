import * as trip_service from '../services/trips.js'

/** create trip
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const create_trip = async (req, res) => {
    try {
        let result = await trip_service.create_trip(req.body.owner_id, req.body.name, req.body.description);
        res.status(201).json({ message: 'Trip created', trip_id: result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create trip', message: err.message });
    }
}

/** get trip by `code` 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const get_trip_by_code = async (req, res) => {
    try {
        const trip = await trip_service.get_trip_by_code(req.params.code);
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get trip', message: err.message });
    }
}

/** get trip by `trip_id` 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const get_trip_by_id = async (req, res) => {
    try {
        const trip = await trip_service.get_trip_by_id(req.params.trip_id);
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get trip', message: err.message });
    }
}

/** update trip
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const update_trip = async (req, res) => {
    try {
        await trip_service.update_trip(req.params.trip_id, req.body.owner_id, req.body.name, req.body.description);
        res.status(201).json({ message: 'Trip updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update trip', message: err.message });
    }
}

/** delete trip
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const delete_trip = async (req, res) => {
    try {
        await trip_service.delete_trip(req.params.trip_id);
        res.status(201).json({ message: 'Trip deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete trip', message: err.message });
    }
}

export const getalltrips = async (req, res) => {
    try {
        const { clerk_id } = req.params;
        const responseData = await trip_service.get_all_trips(clerk_id);
        res.status(201).json({ response: true, data: responseData });
    } catch (err) {
        res.send(500).json({ error: 'Failed to delete trip', message: err.message })
    }
}

/** join a trip by code
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
 */
export const join_trip = async (req, res) => {
    const user_id = req.auth.sessionClaims.user_external_id ?? req.body.user_id;
    const { code } = req.params;
    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return
    }
    try {
        const trip = await trip_service.get_trip_by_code(code);
        if (!trip) {
            res.status(404).json({ error: 'Trip not found' });
            return;
        }
        const result = await trip_service.join_trip(trip.trip_id, user_id);
        res.status(201).json({ message: 'Trip joined', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
