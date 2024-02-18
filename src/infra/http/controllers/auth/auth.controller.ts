import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { UseCaseGetUserById } from '@domain/use-cases/user/get-user-by-id';

import { RequestAuthUser } from '@infra/http/auth/auth-user';
import { Public } from '@infra/http/auth/public';
import {
  UserViewModel,
  UserViewModelResponse,
} from '@infra/http/view-models/user-view-model';

import { CreateSignInBody } from './dto/create-signin-body';
import { CreateSignInResponse } from './dto/create-signin-response';
import { RefreshTokenBody } from './dto/refresh-token-body';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private useCaseCreateSignIn: UseCaseCreateSignIn,
    private useCaseRefreshToken: UseCaseRefreshToken,
    private useCaseGetUserById: UseCaseGetUserById,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  @Public()
  async signIn(@Body() body: CreateSignInBody): Promise<CreateSignInResponse> {
    const { accessToken, refreshToken } =
      await this.useCaseCreateSignIn.execute(body);

    return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  @Public()
  async refreshToken(
    @Body() body: RefreshTokenBody,
  ): Promise<CreateSignInResponse> {
    const { accessToken, refreshToken } =
      await this.useCaseRefreshToken.execute({
        refreshToken: body.refreshToken,
      });

    return { accessToken, refreshToken };
  }

  @Get('profile')
  @ApiResponse({
    type: UserViewModelResponse,
    status: HttpStatus.OK,
  })
  async getProfile(
    @Request() req: RequestAuthUser,
  ): Promise<UserViewModelResponse> {
    const user = await this.useCaseGetUserById.execute({ id: req.user.sub });

    return UserViewModel.toHttp(user);
  }
}