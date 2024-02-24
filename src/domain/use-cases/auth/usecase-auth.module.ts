import { jwtConfig } from '@config/jwt';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from '@infra/http/services/services.module';

import { UseCaseCreateSignIn } from './create-signin';
import { UseCaseRefreshToken } from './refresh-token';

@Module({
  imports: [DatabaseModule, ServicesModule, JwtModule.register(jwtConfig)],
  providers: [UseCaseCreateSignIn, UseCaseRefreshToken],
  exports: [UseCaseCreateSignIn, UseCaseRefreshToken],
})
export class UseCaseAuthModule {}
