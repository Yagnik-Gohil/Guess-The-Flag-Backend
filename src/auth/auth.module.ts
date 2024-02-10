import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { userCreateSchema } from './dto/signup.validation';
import { User } from 'src/user/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { Otp } from 'src/otp/entities/otp.entity';
import { OtpService } from 'src/otp/otp.service';
import { signupOtpSchema } from './dto/signup-otp.validation';
import { loginOtpSchema } from './dto/login-otp.validation';
import { loginUserSchema } from './dto/login-user.validation';
import { loginAdminSchema } from './dto/login-admin.validation';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { verifyToken } from 'src/middleware/verifyToken';
import authorize from 'src/middleware/authorize';
import setIpAddress from 'src/middleware/setIpAddress';
import { DefaultIpColumn } from 'src/shared/constants/enum';
import { verifyStaticToken } from 'src/middleware/verifyStaticToken';
import { EmailService } from 'src/shared/helpers/send-mail';
import { emailValidationSchema } from './dto/email-validation';
import { resetPasswordValidationSchema } from './dto/reset-password-validation';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, UserToken, Otp, Role])],
  controllers: [AuthController],
  providers: [AuthService, OtpService, RoleService, EmailService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        validationMiddleware(userCreateSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'auth/signup/user', method: RequestMethod.POST });
    consumer
      .apply(
        validationMiddleware(signupOtpSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({
        path: 'auth/signup/verify-otp',
        method: RequestMethod.POST,
      });
    consumer
      .apply(
        validationMiddleware(loginUserSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'auth/login/user', method: RequestMethod.POST });
    consumer
      .apply(
        validationMiddleware(loginOtpSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'auth/login/verify-otp', method: RequestMethod.POST });
    consumer
      .apply(validationMiddleware(loginAdminSchema))
      .forRoutes({ path: 'auth/login/admin', method: RequestMethod.POST });
    consumer
      .apply(
        verifyToken,
        authorize(['admin', 'user']),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'auth/logout', method: RequestMethod.POST });
    consumer
      .apply(
        verifyStaticToken,
        validationMiddleware(emailValidationSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'auth/forgot-password', method: RequestMethod.POST });
    consumer
      .apply(
        verifyStaticToken,
        validationMiddleware(resetPasswordValidationSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'auth/reset-password', method: RequestMethod.POST });
  }
}
