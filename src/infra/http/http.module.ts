import { jwtConfig } from '@config/jwt';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UseCaseModule } from '@domain/use-cases/usecase.module';

import { DatabaseModule } from '@infra/database/database.module';

import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    UseCaseModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [UserController, AuthController],
  providers: [],
  exports: [DatabaseModule, ServicesModule],
})
export class HttpModule {}
