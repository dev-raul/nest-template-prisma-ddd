import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIREIN, JWT_SECRECT } from 'src/config/jwt';

import { UseCaseModule } from '@domain/use-cases/usecase.module';

import { DatabaseModule } from '@infra/database/database.module';

import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';
import { ServicesModule } from './services/services';

@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    UseCaseModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRECT,
      signOptions: { expiresIn: JWT_EXPIREIN },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [],
  exports: [DatabaseModule, ServicesModule],
})
export class HttpModule {}
