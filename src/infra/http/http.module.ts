import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';

import { UserController } from './controllers/user/user.controller.spec';
import { CreateUser } from '@domain/use-cases/user/create-user';
import { ServicesModule } from './services/services';

@Module({
  imports: [DatabaseModule, ServicesModule],
  controllers: [UserController],
  providers: [CreateUser],
})
export class HttpModule {}
