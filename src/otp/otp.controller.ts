import { Controller } from '@nestjs/common';
import { OtpService } from './otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
}
