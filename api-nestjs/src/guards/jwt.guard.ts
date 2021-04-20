import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {

  handleRequest (err, user, info: Error) {

    if (err || !user) {
        throw err || new UnauthorizedException();
    }

    return user
  }

}