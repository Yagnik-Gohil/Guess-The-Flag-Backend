import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindManyOptions, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(where: FindManyOptions<User>) {
    const [list, count] = await this.userRepository.findAndCount(where);
    return [plainToInstance(User, list), count];
  }

  async findOne(id: string) {
    // find user
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return plainToClass(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(id, {
      ...updateUserDto,
      updated_at: new Date().toISOString(),
    });
    return user;
  }

  async remove(id: string, deleteDto: DeleteDto) {
    const record = await this.userRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at_ip: deleteDto.deleted_at_ip,
        deleted_at: new Date().toISOString(),
      },
    );
    return record;
  }
}
