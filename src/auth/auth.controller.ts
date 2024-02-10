import { Controller, Post, Body, Res, Req, Next } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response, NextFunction } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from '../user-token/entities/user-token.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CONSTANT } from '../shared/constants/message';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/entities/admin.entity';
import response from '../shared/response';
import { OtpService } from 'src/otp/otp.service';
import sendOtp from 'src/shared/helpers/send-otp';
import generateOtp from 'src/shared/helpers/generate-otp';
import { LoginAdminDto } from './dto/login-admin.dto';
import { VerifySignUpOtpDto } from './dto/verify-signup-otp.dto';
import { VerifyLoginOtpDto } from './dto/verify-login-otp.dto';
import getIp from 'src/shared/helpers/get-ip';
import { RoleService } from 'src/role/role.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/shared/helpers/send-mail';
import { renderFile } from 'ejs';
import { join } from 'path';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DefaultStatus } from 'src/shared/constants/enum';
// import { decrypt } from 'src/shared/helpers/encrypt-decrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly roleService: RoleService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  generateToken = (id, column, table) => {
    return jwt.sign({ id, column, table }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  isTokenExpired = async (token) => {
    try {
      const valid = await jwt.verify(token, process.env.JWT_SECRET);
      if (valid) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return true;
    }
  };

  createUserToken = async (
    payload: {
      fk_user?: string;
      fk_admin?: string;
      token: string;
      device_id: string;
      firebase_token: string;
      created_at_ip: any;
      device_name: string;
      device_type: string;
    },
    fk_table: 'fk_user' | 'fk_admin',
    table: string,
  ) => {
    const isExist = await this.userTokenRepository.findOne({
      where: {
        [table]: { id: payload[fk_table] },
        deleted_at: null,
        device_id: payload.device_id,
      },
    });
    if (isExist) {
      const isExpired = await this.isTokenExpired(isExist.token);
      if (isExpired) {
        // Update with new token
        await this.userTokenRepository.save({
          id: isExist.id,
          token: payload.token,
          firebase_token: payload.firebase_token,
          updated_at_ip: payload.created_at_ip,
          login_time: new Date().toISOString(),
        });
        // New Token
        return payload.token;
      } else {
        // Update Login Time
        await this.userTokenRepository.save({
          id: isExist.id,
          firebase_token: payload.firebase_token,
          updated_at_ip: payload.created_at_ip,
          login_time: new Date().toISOString(),
        });
        // Old token which is not expired
        return isExist.token;
      }
    } else {
      // Create new token
      const token: UserToken = new UserToken();
      token[table] = payload[fk_table];
      token.token = payload.token;
      token.device_id = payload.device_id;
      token.firebase_token = payload.firebase_token;
      token.created_at_ip = payload.created_at_ip;
      token.device_name = payload.device_name;
      token.device_type = payload.device_type;
      token.login_time = new Date().toISOString();
      const result = await this.userTokenRepository.save(token);
      return result.token;
    }
  };

  @Post('login/admin')
  async loginAdmin(
    @Body() loginAdminDto: LoginAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { email, password, device_id, firebase_token, device_type } =
        loginAdminDto;
      const device_name = req.headers['user-agent'];
      const created_at_ip = getIp(req);

      // find admin
      const admin = await this.adminRepository.findOne({
        where: { email },
        relations: ['role'],
        select: ['id', 'email', 'password', 'role', 'name'],
      });

      if (!admin) {
        return response.badRequest(
          { message: CONSTANT.ERROR.WRONG_CREDENTIALS, data: {} },
          res,
        );
      }

      if (admin?.role?.id) {
        const role = await this.roleService.findOne(admin?.role?.id);
        admin.role = role;
      }

      // compare the password
      const isSame = await bcrypt.compare(password, admin.password);
      if (!isSame) {
        return response.badRequest(
          { message: CONSTANT.ERROR.WRONG_CREDENTIALS, data: {} },
          res,
        );
      }

      // generate token
      let token = await this.generateToken(admin.id, 'fk_admin', 'admin');

      // store token and other details of admin
      token = await this.createUserToken(
        {
          fk_admin: admin.id,
          token,
          device_id,
          firebase_token,
          created_at_ip,
          device_name,
          device_type,
        },
        'fk_admin',
        'admin',
      );
      response.successResponse(
        {
          message: CONSTANT.SUCCESS.LOGIN,
          data: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            token: token,
            permission: admin.role,
          },
        },
        res,
      );
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
  @Post('signup/user')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const where = {
        email: createUserDto.email,
      };
      const already = await this.userRepository.findOne({ where });
      if (already) {
        return response.badRequest(
          {
            message: CONSTANT.ERROR.ALREADY_EXISTS('Email'),
            data: where,
          },
          res,
        );
      }
      const result = await this.authService.signUp(createUserDto);

      // Store OTP to database
      const createOtp = {
        user: result,
        type: 'signup',
        email: result.email,
        otp: generateOtp(),
        created_at_ip: result.created_at_ip,
        expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
      };
      const otp = await this.otpService.create(createOtp);
      // Send OTP to user's mobile
      await sendOtp(result, otp.otp);

      return response.successResponse(
        {
          message: CONSTANT.SUCCESS.COMPLETE_VERIFICATION('Signup'),
          data: { id: result.id },
        },
        res,
      );
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
  @Post('login/user') // This is Send OTP API
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const { email } = loginUserDto;

      // find user
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'status'],
      });
      if (!user) {
        return response.badRequest(
          { message: CONSTANT.ERROR.WRONG_CREDENTIALS, data: {} },
          res,
        );
      }
      // if Signup otp is not verified, then send new signup otp
      if (user.status == DefaultStatus.IN_ACTIVE) {
        // There is always one entry of signup OTP. We are sending it at signup time
        let otp = await this.otpService.findOne({
          where: {
            user: {
              id: user.id,
            },
            type: 'signup',
          },
        });

        // In case of first signup OTP is not created
        if (!otp) {
          // Store OTP to database
          const createOtp = {
            user: user,
            type: 'signup',
            email: user.email,
            otp: generateOtp(),
            created_at_ip: loginUserDto.created_at_ip,
            expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
          };
          otp = await this.otpService.create(createOtp);
          // Send OTP to user's mobile
          await sendOtp(user, otp.otp);
        } else {
          // Update Old OTP
          const updateOtp = {
            otp: generateOtp(),
            updated_at_ip: loginUserDto.updated_at_ip,
            expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
          };
          await this.otpService.update(otp.id, updateOtp);
          // Send OTP to user's mobile
          await sendOtp(user, updateOtp.otp);
        }

        const is_expired =
          otp.expire_at - Math.floor(Date.now() / 1000) > 0 ? false : true;

        // If otp Expired then send expired message.
        if (is_expired) {
          return response.successResponse(
            {
              message: CONSTANT.SUCCESS.OTP_EXPIRED('Signup'),
              data: { type: 'signup' },
            },
            res,
          );
        }
        return response.successResponse(
          {
            message: CONSTANT.SUCCESS.COMPLETE_VERIFICATION('Signup'),
            data: { type: 'signup' },
          },
          res,
        );
      }

      if (user.status === DefaultStatus.ACTIVE) {
        const isExist = await this.otpService.findOne({
          where: {
            is_verified: false,
            type: 'login',
            email,
          },
          relations: {
            user: true,
          },
        });
        // If otp already Exists
        if (isExist) {
          // Update Old OTP
          const updateOtp = {
            updated_at_ip: loginUserDto.updated_at_ip,
            otp: generateOtp(),
            expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
          };
          await this.otpService.update(isExist.id, updateOtp);
          // Send OTP to user's mobile
          await sendOtp(user, updateOtp.otp);

          const is_expired =
            isExist.expire_at - Math.floor(Date.now() / 1000) > 0
              ? false
              : true;
          // If otp Expired then send expired message.
          if (is_expired) {
            return response.successResponse(
              {
                message: CONSTANT.SUCCESS.OTP_EXPIRED('Login'),
                data: { id: user.id, type: 'login' },
              },
              res,
            );
          } else {
            return response.successResponse(
              {
                message: CONSTANT.SUCCESS.COMPLETE_VERIFICATION('Login'),
                data: { id: user.id, type: 'login' },
              },
              res,
            );
          }
        } else {
          // Send New OTP
          // Store OTP to database
          const createOtp = {
            user: user,
            type: 'login',
            email: user.email,
            created_at_ip: loginUserDto.created_at_ip,
            otp: generateOtp(),
            expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
          };
          const otp = await this.otpService.create(createOtp);
          // Send OTP to user's mobile
          await sendOtp(user, otp.otp);

          return response.successResponse(
            {
              message: CONSTANT.SUCCESS.COMPLETE_VERIFICATION('Login'),
              data: { id: user.id, type: 'login' },
            },
            res,
          );
        }
      }
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Post('logout')
  async logout(
    @Req() req: any,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return response.unAuthorizedRequest(res);
      }

      const token = authHeader.split(' ')[1];

      const isExist = await this.userTokenRepository.findOne({
        where: {
          [req.user.table]: { id: req.user.id },
          token: token,
          deleted_at: IsNull(),
        },
      });

      if (!isExist) {
        const data = {
          message: CONSTANT.ERROR.METHOD_NOT_ALLOWED,
          data: {},
        };
        response.successResponse(data, res);
      }
      const time = new Date().toISOString();
      const result = await this.userTokenRepository.update(
        { id: isExist.id, deleted_at: IsNull() },
        {
          token: 'logged out',
          logout_time: time,
          deleted_at_ip: req.body.updated_at_ip,
          deleted_at: time,
        },
      );
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.LOGOUT
          : CONSTANT.ERROR.METHOD_NOT_ALLOWED,
        data: {},
      };
      response.successResponse(data, res);

      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
  @Post('signup/verify-otp')
  async verify(
    @Body() verifySignUpOtpDto: VerifySignUpOtpDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const isExist = await this.otpService.findOne({
        where: {
          is_verified: false,
          type: 'signup',
          email: verifySignUpOtpDto.email,
          otp: verifySignUpOtpDto.otp,
        },
        relations: {
          user: true,
        },
      });
      if (isExist) {
        const is_expired =
          isExist.expire_at - Math.floor(Date.now() / 1000) > 0 ? false : true;
        if (is_expired) {
          // Update Old OTP
          const updateOtp = {
            otp: generateOtp(),
            updated_at_ip: verifySignUpOtpDto.updated_at_ip,
            expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
          };
          await this.otpService.update(isExist.id, updateOtp);
          // Send OTP to user's mobile
          await sendOtp(isExist.user, updateOtp.otp);

          return response.successResponse(
            {
              message: CONSTANT.SUCCESS.OTP_EXPIRED('Signup'),
              data: {},
            },
            res,
          );
        } else {
          // Verify OTP and Verify User
          await this.otpService.update(isExist.id, {
            is_verified: true,
            updated_at_ip: verifySignUpOtpDto.updated_at_ip,
            deleted_at: new Date().toISOString(),
          });
          await this.userRepository.update(isExist.user.id, {
            updated_at_ip: verifySignUpOtpDto.updated_at_ip,
            status: DefaultStatus.ACTIVE,
          });
        }
      } else {
        // Otp is already verified or wrong OTP
        return response.recordNotFound(
          { message: CONSTANT.ERROR.WRONG_CREDENTIALS, data: {} },
          res,
        );
      }
      const data = {
        message: CONSTANT.SUCCESS.OTP_VERIFIED,
        data: {},
      };
      response.successResponse(data, res);

      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
  @Post('login/verify-otp')
  async verifyLogin(
    @Body() verifyLoginOtpDto: VerifyLoginOtpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { email, otp } = verifyLoginOtpDto;
      const isExist = await this.otpService.findOne({
        where: {
          is_verified: false,
          type: 'login',
          email,
          otp,
        },
        relations: {
          user: true,
        },
      });
      if (isExist) {
        const is_expired =
          isExist.expire_at - Math.floor(Date.now() / 1000) > 0 ? false : true;
        if (is_expired) {
          // Delete expired OTP
          await this.otpService.update(isExist.id, {
            deleted_at: new Date(),
          });
          return response.recordNotFound(
            { message: CONSTANT.ERROR.OTP_EXPIRED, data: {} },
            res,
          );
        } else {
          // Verify OTP and Login User
          await this.otpService.update(isExist.id, {
            updated_at_ip: verifyLoginOtpDto.updated_at_ip,
            is_verified: true,
            deleted_at: new Date(),
          });

          const { device_id, firebase_token, device_type } = verifyLoginOtpDto;
          const device_name = req.headers['user-agent'];
          const created_at_ip = getIp(req);

          // generate token
          let token = await this.generateToken(
            isExist.user.id,
            'fk_user',
            'user',
          );

          // store token and other details of user
          // Create or update
          token = await this.createUserToken(
            {
              fk_user: isExist.user.id,
              token,
              device_id,
              firebase_token,
              created_at_ip,
              device_name,
              device_type,
            },
            'fk_user',
            'user',
          );
          return response.successResponse(
            {
              message: CONSTANT.SUCCESS.LOGIN,
              data: {
                ...isExist.user,
                token: token,
              },
            },
            res,
          );
        }
      } else {
        // Otp is already verified or invalid OTP
        return response.recordNotFound(
          { message: CONSTANT.ERROR.WRONG_CREDENTIALS, data: {} },
          res,
        );
      }
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { email: forgotPasswordDto.email },
      });
      if (!admin) {
        return response.badRequest(
          { message: CONSTANT.SUCCESS.RECORD_NOT_FOUND('Record'), data: {} },
          res,
        );
      }

      const emailService = new EmailService();

      const createOtp = {
        admin: admin,
        type: 'forgot_password',
        email: admin.email,
        otp: generateOtp(),
        created_at_ip: forgotPasswordDto.created_at_ip,
        expire_at: Math.floor((Date.now() + 600000) / 1000), // Add 10 minutes (600,000 milliseconds) to the current timestamp & Convert future timestamp to seconds
      };
      const otp = await this.otpService.create(createOtp);

      const ejsTemplate = await renderFile(
        join(__dirname + '/../../shared/ejs-templates/forgot-password.ejs'),
        {
          name: admin.name,
          otp: otp.otp,
          resetUrl: '',
        },
      );
      await emailService.sendMail({
        to: admin.email,
        subject: CONSTANT.EMAIL.FORGOT_PASSWORD,
        html: ejsTemplate,
      });

      response.successResponse(
        {
          message: CONSTANT.SUCCESS.EMAIL_SENT,
          data: {},
        },
        res,
      );
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { email: resetPasswordDto.email },
      });
      if (!admin) {
        return response.badRequest(
          { message: CONSTANT.SUCCESS.RECORD_NOT_FOUND('Record'), data: {} },
          res,
        );
      }

      const isExist = await this.otpService.findOne({
        where: {
          is_verified: false,
          type: 'forgot_password',
          admin: {
            id: admin.id,
          },
        },
      });
      if (isExist) {
        const is_expired =
          isExist.expire_at - Math.floor(Date.now() / 1000) > 0 ? false : true;
        if (is_expired) {
          // Delete expired OTP
          await this.otpService.update(isExist.id, {
            deleted_at: new Date(),
          });
          return response.recordNotFound(
            { message: CONSTANT.ERROR.OTP_EXPIRED, data: {} },
            res,
          );
        } else {
          // Verify OTP and Login User
          await this.otpService.update(isExist.id, {
            is_verified: true,
            deleted_at: new Date(),
          });

          const password = await bcrypt.hash(resetPasswordDto.password, 10);
          const result = await this.adminRepository.update(admin.id, {
            password: password,
            updated_at_ip: resetPasswordDto.updated_at_ip,
          });

          const data = {
            message: result.affected
              ? CONSTANT.SUCCESS.RECORD_UPDATED('Password')
              : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Admin'),
            data: {},
          };
          response.successResponse(data, res);
        }
      } else {
        // Otp is already verified or invalid OTP
        return response.recordNotFound(
          { message: CONSTANT.ERROR.WRONG_CREDENTIALS, data: {} },
          res,
        );
      }
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
}
