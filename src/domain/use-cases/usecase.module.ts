import { Module } from '@nestjs/common';

import { UseCaseAuthModule } from './auth/usecase-auth.module';
import { UseCaseUserModule } from './user/usecase-user.module';

@Module({
  imports: [UseCaseAuthModule, UseCaseUserModule],
  exports: [UseCaseAuthModule, UseCaseUserModule],
})
export class UseCaseModule {}
