import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [DatabaseModule],
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
