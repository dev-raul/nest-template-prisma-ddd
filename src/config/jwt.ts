import { JwtModuleOptions } from '@nestjs/jwt';
import 'dotenv/config';

const EXPIREIN = Number(process.env?.JWT_EXPIREIN ?? 60);
export const JWT_SECRECT = process.env.JWT_SECRECT;
export const JWT_REFRESH_TOKEN_SECRECT = process.env.JWT_REFRESH_TOKEN_SECRECT;
export const JWT_EXPIREIN = `${EXPIREIN}s`;
export const JWT_REFRESH_TOKEN_EXPIREIN = `${EXPIREIN * 2}s`;
export const jwtConfig: JwtModuleOptions = {
  global: true,
  secret: JWT_SECRECT,
  signOptions: { expiresIn: JWT_EXPIREIN },
};
