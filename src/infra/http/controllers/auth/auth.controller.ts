import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateSignInBody } from './dto/create-signin-body';
import { CreateSignInResponse } from './dto/create-signin-response';
import { UseCaseGetUser } from '@domain/use-cases/user/get-user';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserViewModel,
  UserViewModelResponse,
} from '@infra/http/view-models/user-view-model';
import { Public } from '@infra/http/auth/public';
import { RefreshTokenBody } from './dto/refresh-token-body';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { AuthUser, RequestAuthUser } from '@infra/http/auth/auth-user';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private useCaseCreateSignIn: UseCaseCreateSignIn,
    private useCaseRefreshToken: UseCaseRefreshToken,
    private useCaseGetUser: UseCaseGetUser,
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
    const user = await this.useCaseGetUser.execute({ id: req.user.sub });

    return UserViewModel.toHttp(user);
  }
}
