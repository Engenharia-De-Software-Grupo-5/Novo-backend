import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayload } from 'src/contracts/auth';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
