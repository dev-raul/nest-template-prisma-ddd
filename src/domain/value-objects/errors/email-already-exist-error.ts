import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistError extends HttpException {
  constructor(email: string) {
    super(`The email '${email}' already exist.`, HttpStatus.BAD_REQUEST);
  }
}
