import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { verifyToken } from 'src/middleware/verifyToken';
import authorize from 'src/middleware/authorize';
import setIpAddress from 'src/middleware/setIpAddress';
import { DefaultIpColumn } from 'src/shared/constants/enum';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { countryCreateSchema } from './dto/create-country-validation';
import { countryUpdateSchema } from './dto/update-country-validation';
import { Country } from './entities/country.entity';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken, Country])],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        validationMiddleware(countryCreateSchema),
        setIpAddress([
          DefaultIpColumn.CREATED_AT_IP,
          DefaultIpColumn.UPDATED_AT_IP,
        ]),
      )
      .forRoutes({ path: 'country', method: RequestMethod.POST });
    consumer
      .apply(verifyToken, authorize(['admin']))
      .forRoutes({ path: 'country', method: RequestMethod.GET });
    consumer
      .apply(verifyToken, authorize(['admin']))
      .forRoutes({ path: 'country/:id', method: RequestMethod.GET });
    consumer
      .apply(
        validationMiddleware(countryUpdateSchema),
        setIpAddress([DefaultIpColumn.UPDATED_AT_IP]),
      )
      .forRoutes({ path: 'country/:id', method: RequestMethod.PATCH });
    consumer
      .apply(
        verifyToken,
        authorize(['admin']),
        setIpAddress([DefaultIpColumn.DELETED_AT_IP]),
      )
      .forRoutes({ path: 'country/:id', method: RequestMethod.DELETE });
  }
}
