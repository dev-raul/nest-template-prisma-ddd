import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundError extends HttpException {
  constructor(item: string) {
    super(`The '${item}' not found.`, HttpStatus.NOT_FOUND);
  }
}
