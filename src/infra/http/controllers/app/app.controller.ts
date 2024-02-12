import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  get() {
    return {
      message: 'Nest js template with prisma(pg), logger and http router',
    };
  }
}
