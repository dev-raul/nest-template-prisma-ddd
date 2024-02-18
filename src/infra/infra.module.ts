import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logger/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './http/auth/auth.guard';

@Module({
  imports: [HttpModule, LoggerModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class InfraModule {}
