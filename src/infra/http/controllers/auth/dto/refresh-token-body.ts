import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenBody {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
