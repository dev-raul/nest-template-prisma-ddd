import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

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

  @ApiOperation({ summary: 'Create user signin' })
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @Public()
  async signIn(@Body() body: CreateSignInBody): Promise<CreateSignInResponse> {
    const { accessToken, refreshToken } =
      await this.useCaseCreateSignIn.execute(body);

    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: 'Generate new valid token by refreshToken' })
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
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

  @ApiOperation({ summary: 'Get user by current session' })
  @Get('profile')
  @ApiResponse({
    type: UserViewModelResponse,
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  async getProfile(
    @Request() req: RequestAuthUser,
  ): Promise<UserViewModelResponse> {
    const user = await this.useCaseGetUserById.execute({ id: req.user.sub });

    return UserViewModel.toHttp(user);
  }
}
