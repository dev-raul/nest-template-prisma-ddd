import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserBody } from './dto/user-create-body';
import { CreateUser } from '@domain/use-cases/user/create-user';
import {
  UserViewModel,
  UserViewModelResponse,
} from '@infra/http/view-models/user-view-model';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private createUser: CreateUser) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @ApiCreatedResponse({ type: UserViewModelResponse })
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
