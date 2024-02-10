import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { verifyToken } from 'src/middleware/verifyToken';
import authorize from 'src/middleware/authorize';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { User } from './entities/user.entity';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { userEditForAdminSchema } from './dto/update-user-validation';
import { userEditSchema } from './dto/user-edit-validation.schema';
import { EmailService } from 'src/shared/helpers/send-mail';
import setIpAddress from 'src/middleware/setIpAddress';
import { DefaultIpColumn } from 'src/shared/constants/enum';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserToken])],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyToken, authorize(['admin']))
      .forRoutes({ path: 'user', method: RequestMethod.GET });
    consumer
      .apply(verifyToken, authorize(['admin']))
      .forRoutes({ path: 'user/profile/:id', method: RequestMethod.GET });
    consumer
      .apply(verifyToken, authorize(['user']))
      .forRoutes({ path: 'user/profile', method: RequestMethod.GET });
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        validationMiddleware(userEditForAdminSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'user/edit/:id', method: RequestMethod.PATCH });
    consumer
      .apply(
        verifyToken,
        authorize(['user']),
        validationMiddleware(userEditSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'user/edit', method: RequestMethod.PATCH });
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        setIpAddress([DefaultIpColumn.DELETED_AT_IP]),
      )
      .forRoutes({ path: 'user/:id', method: RequestMethod.DELETE });
  }
}
