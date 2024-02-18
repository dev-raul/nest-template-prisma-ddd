import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logger/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './http/auth/auth.guard';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, HttpModule, LoggerModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [DatabaseModule],
})
export class InfraModule {}
