import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { validationSchema } from '../config/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { database } from 'config/database';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { UserTokenModule } from './user-token/user-token.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { OtpModule } from './otp/otp.module';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../../config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => database(configService),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../../public`,
      exclude: ['/api/(.*)'],
    }),
    AuthModule,
    AdminModule,
    UserModule,
    UserTokenModule,
    PermissionModule,
    RoleModule,
    OtpModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
