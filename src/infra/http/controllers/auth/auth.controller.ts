import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateSignInBody } from './dto/create-signin-body';
import { CreateSignInResponse } from './dto/create-signin-response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private useCaseCreateSignIn: UseCaseCreateSignIn) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  async signIn(@Body() body: CreateSignInBody): Promise<CreateSignInResponse> {
    const { accessToken } = await this.useCaseCreateSignIn.execute(body);

    return { accessToken };
  }
}
