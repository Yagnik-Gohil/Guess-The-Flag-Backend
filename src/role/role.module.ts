import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { verifyToken } from 'src/middleware/verifyToken';
import authorize from 'src/middleware/authorize';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { roleCreateSchema } from './dto/create-role-validation';
import { roleUpdateSchema } from './dto/update-role-validation';
import setIpAddress from 'src/middleware/setIpAddress';
import { DefaultIpColumn } from 'src/shared/constants/enum';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken, Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyToken, authorize(['admin'])).forRoutes('role');
    consumer
      .apply(
        validationMiddleware(roleCreateSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'role', method: RequestMethod.POST });
    consumer
      .apply(
        validationMiddleware(roleUpdateSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'role/:id', method: RequestMethod.PATCH });
    consumer
      .apply(setIpAddress([DefaultIpColumn.DELETED_AT_IP]))
      .forRoutes({ path: 'role/:id', method: RequestMethod.DELETE });
  }
}
