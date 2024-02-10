import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import authorize from 'src/middleware/authorize';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { verifyToken } from 'src/middleware/verifyToken';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { adminCreateSchema } from './dto/create-admin-validation';
import { adminUpdateSchema } from './dto/update-admin-validation';
import setIpAddress from 'src/middleware/setIpAddress';
import { DefaultIpColumn } from 'src/shared/constants/enum';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, UserToken])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyToken, authorize(['admin'])).forRoutes('admin');
    consumer
      .apply(
        validationMiddleware(adminCreateSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'admin', method: RequestMethod.POST });
    consumer
      .apply(
        validationMiddleware(adminUpdateSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'admin/:id', method: RequestMethod.PATCH });
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        setIpAddress([DefaultIpColumn.DELETED_AT_IP]),
      )
      .forRoutes({ path: 'admin/:id', method: RequestMethod.DELETE });
  }
}
