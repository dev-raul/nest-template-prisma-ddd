import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';

import { AppController } from './controllers/app/app.controller';
import { UserController } from './controllers/user/user.controller.spec';
import { CreateUser } from '@domain/use-cases/user/create-user';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, UserController],
  providers: [CreateUser],
})
export class HttpModule {}
