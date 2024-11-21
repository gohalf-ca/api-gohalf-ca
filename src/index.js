import config from './lib/config.js';
import app from './app.js';
import { connect_to_db } from './lib/database.js';

const exitHandler = () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    } else {
        process.exit(1);
    }
}

let server = null;


(async () => {
    try {
        await connect_to_db();

        server = app.listen(config.port ?? 3000, () => {
            console.log(`Listening to port ${config.port}`)
        });

        const unexpectedErrorHandler = (error) => {
            console.error(error);
            exitHandler();
        }

        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);

        //  @INFO: Signal Interrupt
        process.on('SIGINT', () => {
            console.info('SIGINT received: closing the server gracefully');
            exitHandler();
        });

        //  @INFO: Signal Termination
        process.on('SIGTERM', () => {
            console.info('SIGTERM received: closing the server gracefully');
            exitHandler();
        });
    } catch (err) {
        console.error("Failed to start the server", err);
        process.exit(1);
    }
})();
