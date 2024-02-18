import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@infra/database/database.module';
import { UseCaseModule } from '@domain/use-cases/usecase.module';
import { ServicesModule } from './services/services';

import { UserController } from './controllers/user/user.controller';
import { AuthController } from './controllers/auth/auth.controller';

import { JWT_EXPIREIN, JWT_SECRECT } from 'src/config/jwt';

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
