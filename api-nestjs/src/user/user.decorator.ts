import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './user.dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestWithUser;

    const user = request.user;

    return data ? user && user[data] : user;
  },
);
