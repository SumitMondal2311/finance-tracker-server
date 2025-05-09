import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './configs/env.config';
import { morganStream } from './lib/morgan-stream';
import { appLogger } from './lib/winston';
import { Error } from './types/error.type';

export const app = express();

app.use(cookieParser());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('combined', { stream: morganStream }));

app.get('/healthz', (req: Request, res: Response) => {
    res.status(200).json({ ok: true, uptime: process.uptime() });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    appLogger.error(err);

    res.status(err.status || 500).json({
        ok: false,
        message: err.message || 'Internal server error',
    });
});
