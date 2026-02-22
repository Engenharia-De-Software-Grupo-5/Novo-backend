import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../database/prisma.service';
import { ROLES_KEY } from '../decorators';
import { AuthPayload } from 'src/contracts/auth';

interface RequestWithAuth extends Request {
  user?: AuthPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const classRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getClass(),
      ]) || [];

    const methodRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
      ]) || [];

    const requiredFunctionalities = Array.from(
      new Set([...classRoles, ...methodRoles]),
    );

    if (!requiredFunctionalities.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Token inválido.');
    }

    if (!user.permission) {
      throw new ForbiddenException('Token sem permissão definida.');
    }

    const permission = await this.prisma.permissions.findUnique({
      where: { id: user.permission },
    });

    if (!permission?.functionalities) {
      throw new ForbiddenException('Permissão inválida.');
    }

    const hasAccess = requiredFunctionalities.some((functionalitiy) =>
      permission.functionalities.includes(functionalitiy),
    );

    if (!hasAccess && !permission.functionalities.includes('ALL')) {
      throw new ForbiddenException(
        'Você não tem acesso a esta funcionalidade.',
      );
    }

    return true;
  }
}
