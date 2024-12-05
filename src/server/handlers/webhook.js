import 'dotenv/config';
import { Webhook } from 'svix';
// import { connect_to_db } from '../../database/database.js';
import config from '../../lib/config.js';
import { create_user } from '../services/users.js';
import { clerkClient } from '@clerk/express';

/** webhook
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
*/
export const clerk_webhook = async (req, res) => {
    // Create new Svix instance with secret
    const wh = new Webhook(config.clerk.signing_secret)

    // Get headers and body
    const headers = req.headers
    const payload = req.body

    // Get Svix headers for verification
    const svix_id = headers['svix-id']
    const svix_timestamp = headers['svix-timestamp']
    const svix_signature = headers['svix-signature']

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return void res.status(400).json({
            success: false,
            message: 'Error: Missing svix headers',
        })
    }

    let evt

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If verification fails, error out and return error code
    try {
        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err) {
        console.log('Error: Could not verify webhook:', err.message)
        return void res.status(400).json({
            success: false,
            message: err.message,
        })
    }

    // Do something with payload
    // For this guide, log payload to console
    const event_type = evt.type
    if (event_type == 'user.created') {
        const { id, email_addresses } = evt.data;
        if (email_addresses.length > 0) {
            const email = email_addresses[0].email_address;
            if (id && email) {
                try {
                    const result = await create_user(id, email);
                    if (result.user_id && result.clerk_id) {
                        void clerkClient.users.updateUser(result.clerk_id, { externalId: String(result.user_id) });
                    }
                } catch (err) {
                    console.log("Error: ", err);
                }
            }
        }
    }

    return void res.status(200).json({
        success: true,
        message: 'Webhook received',
    })
}
