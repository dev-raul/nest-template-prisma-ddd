import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logger/logger.module';

@Module({
  imports: [HttpModule, LoggerModule],
})
export class InfraModule {}
