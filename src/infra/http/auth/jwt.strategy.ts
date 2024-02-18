import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { base64Encode } from '@utils/base64-encode';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: base64Encode(process.env.JWT_PUBLIC_KEY),
      algorithms: ['RS256'],
    });
  }
}
