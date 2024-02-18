import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logger/logger.module';

import { DatabaseModule } from './database/database.module';
import { AuthGuard } from './http/auth/auth.guard';

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
