import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailBadFormattedError extends HttpException {
  constructor(email: string) {
    super(`The email '${email}' is bad formatted.`, HttpStatus.BAD_REQUEST);
  }
}
