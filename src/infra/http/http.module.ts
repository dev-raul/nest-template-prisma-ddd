import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';

import { UserController } from './controllers/user/user.controller.spec';
import { CreateUser } from '@domain/use-cases/user/create-user';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [CreateUser],
})
export class HttpModule {}
