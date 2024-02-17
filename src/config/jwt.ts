import 'dotenv/config';

export const JWT_SECRECT = process.env.JWT_SECRECT;
export const JWT_EXPIREIN = process.env.JWT_EXPIREIN ?? '60s';
