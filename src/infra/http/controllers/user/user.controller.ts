import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UseCaseCreateUser } from '@domain/use-cases/user/create-user';
import { UserViewModel } from '@infra/http/view-models/user-view-model';

import { CreateUserBody } from './dto/create-user-body';
import { CreateUserResponse } from './dto/create-user-response';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private useCaseCreateUser: UseCaseCreateUser) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @ApiResponse({ type: CreateUserResponse, status: HttpStatus.CREATED })
  async post(@Body() body: CreateUserBody): Promise<CreateUserResponse> {
    const user = await this.useCaseCreateUser.execute({
      email: body.email,
      password: body.password,
    });
    return {
      user: UserViewModel.toHttp(user),
    };
  }
}
