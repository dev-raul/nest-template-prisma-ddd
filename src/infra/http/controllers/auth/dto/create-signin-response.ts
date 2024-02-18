import { ApiProperty } from '@nestjs/swagger';

export class CreateSignInResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
