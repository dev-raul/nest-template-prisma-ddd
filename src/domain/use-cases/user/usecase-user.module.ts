import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from '@infra/http/services/services.module';

import { UseCaseCreateUser } from './create-user';
import { UseCaseGetUserById } from './get-user-by-id';

@Module({
  imports: [DatabaseModule, ServicesModule],
  providers: [UseCaseGetUserById, UseCaseCreateUser],
  exports: [UseCaseGetUserById, UseCaseCreateUser],
})
export class UseCaseUserModule {}
