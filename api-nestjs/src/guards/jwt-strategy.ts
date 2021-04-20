import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../user/user.service'

import { UserEntity } from '../models/user.model'

export interface AccessTokenPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private users: UserService

  public constructor (users: UserService) {       
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.EXPIRES_IN,
      },
    })
    this.users = users
  }

  async validate (payload: AccessTokenPayload): Promise<UserEntity> {    
    const { sub: id } = payload

    const user = await this.users.findByID(id)

    if (!user) {
        throw new UnauthorizedException();
    }

    return user
  }
}