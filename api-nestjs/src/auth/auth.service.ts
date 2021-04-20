import { RequestWithUser, UserWithID } from './../user/user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  signToken(user: UserWithID) {
    return sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  resolveToken(token: string) {
    return verify(token, process.env.JWT_SECRET);
  }

  extractFromHeaders(req: RequestWithUser) {
    const tokenWithBearer = req.headers.authorization;

    if (!tokenWithBearer) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }

    const token = tokenWithBearer.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }

    return token;
  }
}
