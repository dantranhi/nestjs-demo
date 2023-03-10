import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt-authentication.guard';
import { RequestWithUser } from 'src/auth/interface/request-user.interface';
import Role from 'src/enums/role.enum';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
