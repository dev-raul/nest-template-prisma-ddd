import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialError extends HttpException {
  constructor() {
    super(`Invalid Credentials.`, HttpStatus.BAD_REQUEST);
  }
}
