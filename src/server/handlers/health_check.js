import { connect_to_db } from '../../database/database.js';

/** health_check
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
*/
export const health_check = async (_, res) => {
    const db_stats = await db_health();
    if (db_stats.status === 'down') {
        return res.status(503).json(db_stats);
    }
    res.status(200).json(db_stats);
}

async function db_health() {
  const stats = {};

  try {
    // Get the database connection
    const db = await connect_to_db();

    // Set a timeout for the health check
    const timeout = setTimeout(() => {
      throw new Error('Health check timed out');
    }, 1000);

    // Ping the database
    await db.query('SELECT 1');
    clearTimeout(timeout);

    // If successful, set the status as up
    stats.status = 'up';
    stats.message = "It's healthy";

    // Retrieve database db stats
    const poolStats = db.totalCount; // Total number of clients in the db
    const idleCount = db.idleCount; // Clients currently idle in the db
    const waitingCount = db.waitingCount; // Clients currently waiting for a connection

    stats.open_connections = poolStats.toString();
    stats.idle = idleCount.toString();
    stats.wait_count = waitingCount.toString();

    // Evaluate stats to provide a health message
    if (poolStats > 40) {
      stats.message = 'The database is experiencing heavy load.';
    }

    if (waitingCount > 1000) {
      stats.message = 'The database has a high number of wait events, indicating potential bottlenecks.';
    }

    if (idleCount > poolStats / 2) {
      stats.message = 'Many idle connections are being closed, consider revising the connection db settings.';
    }
  } catch (error) {
    // If an error occurs, log the issue and set the status as down
    stats.status = 'down';
    stats.error = `db down: ${error.message}`;
    console.error('Database health check failed:', error);
  }

  return stats;
}

