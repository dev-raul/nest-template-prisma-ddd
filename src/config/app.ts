import 'dotenv/config';

export const PORT = Number(process.env.APP_PORT ?? 3333);
export const ENV = process.env.NODE_ENV ?? 'development';
export const APP_NAME = process.env.APP_NAME ?? 'nest-template-prisma-ddd';
export const APP_VERSION = process.env.APP_VERSION ?? '1.0.0';
