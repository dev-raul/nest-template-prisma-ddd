import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserBody } from './dtos/user-create-body';
import { CreateUser } from '@domain/use-cases/user/create-user';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

@Controller('/users')
export class UserController {
  constructor(private createUser: CreateUser) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async post(@Body() body: CreateUserBody) {
    const user = await this.createUser.execute({
      email: body.email,
      password: body.password,
    });
    return {
      user: UserViewModel.toHttp(user),
    };
  }
}
