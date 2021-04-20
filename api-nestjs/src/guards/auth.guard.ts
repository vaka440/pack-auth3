import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithUser } from '../user/user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AuthService') private authService: AuthService) {}

  canActivate(
    ctx: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    const req = ctx.switchToHttp().getRequest() as RequestWithUser;

    try {
      const token = this.authService.extractFromHeaders(req);
      const { id, role, email } = this.authService.resolveToken(
        token,
      ) as any;

      req.user = { id, role, email };

      return true;
    } catch (error) {   
      return false;
    }
  }
}
