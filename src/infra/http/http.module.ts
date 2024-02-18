import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from './services/services';
import { JwtModule } from '@nestjs/jwt';

import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';
import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseGetUser } from '@domain/use-cases/user/get-user';

import { UserController } from './controllers/user/user.controller';
import { AuthController } from './controllers/auth/auth.controller';

import { JWT_EXPIREIN, JWT_SECRECT } from 'src/config/jwt';

@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRECT,
      signOptions: { expiresIn: JWT_EXPIREIN },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UseCaseCreateUser, UseCaseGetUser, UseCaseCreateSignIn],
})
export class HttpModule {}
