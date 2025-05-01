import { app } from './app';
import { env } from './configs/env.config';
import { appLogger } from './lib/winston';

const server = app.listen(env.PORT, () => {
    appLogger.info(`Server is running on port: ${env.PORT}`);
});

process.on('SIGTERM', () => {
    appLogger.info('SIGTERM received, shutting down...');
    server.close(() => {
        appLogger.info('Server closed');
        process.exit(0);
    });
});
