import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}
  async create(createOtpDto: CreateOtpDto) {
    const result = await this.otpRepository.save(createOtpDto);
    return plainToClass(Otp, result);
  }

  async findOne(where: FindOneOptions<Otp>) {
    const result = await this.otpRepository.findOne(where);
    return plainToClass(Otp, result);
  }

  async update(id: string, updateOtpDto: UpdateOtpDto) {
    const result = await this.otpRepository.update(id, updateOtpDto);
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
