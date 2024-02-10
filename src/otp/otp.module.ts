import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpController } from './otp.controller';
import validationMiddleware from 'src/middleware/validation/validation-middleware';
import { otpVerifySchema } from './dto/verify-otp-validation';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validationMiddleware(otpVerifySchema))
      .forRoutes({ path: 'otp', method: RequestMethod.POST });
  }
}
