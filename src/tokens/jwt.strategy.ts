import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'supersecret'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById?.(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
