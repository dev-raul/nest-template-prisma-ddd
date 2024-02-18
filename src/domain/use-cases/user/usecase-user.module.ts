import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from '@infra/http/services/services';
import { UseCaseGetUser } from './get-user';
import { UseCaseCreateUser } from './create-user';

@Module({
  imports: [DatabaseModule, ServicesModule],
  providers: [UseCaseGetUser, UseCaseCreateUser],
  exports: [UseCaseGetUser, UseCaseCreateUser],
})
export class UseCaseUserModule {}
