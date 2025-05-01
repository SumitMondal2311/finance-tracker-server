import { config } from 'dotenv';
config();

import z from 'zod';
import { appLogger } from '../lib/winston';

const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z
        .string()
        .min(4)
        .transform((str) => parseInt(str, 10)),
    FRONTEND_URL: z.string().trim().url(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    appLogger.error(`Invalid or missing ${parsed.error.issues[0].path} variable`);
    process.exit(1);
}

export const env = parsed.data;
