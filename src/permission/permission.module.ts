import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from './entities/permission.entity';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { verifyToken } from 'src/middleware/verifyToken';
import authorize from 'src/middleware/authorize';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { permissionCreateSchema } from './dto/create-permission-validation';
import setIpAddress from 'src/middleware/setIpAddress';
import { DefaultIpColumn } from 'src/shared/constants/enum';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken, Permission])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        validationMiddleware(permissionCreateSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'permission', method: RequestMethod.POST });
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        validationMiddleware(permissionCreateSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'permission/:id', method: RequestMethod.PATCH });
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        setIpAddress([DefaultIpColumn.DELETED_AT_IP]),
      )
      .forRoutes({ path: 'permission/:id', method: RequestMethod.DELETE });
  }
}
