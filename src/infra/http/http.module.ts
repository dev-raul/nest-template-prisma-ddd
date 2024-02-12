import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { AppController } from './controllers/app/app.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [
    // UserResolver,
    // JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JWTAuthGuard,
    // },
  ],
})
export class HttpModule {}
