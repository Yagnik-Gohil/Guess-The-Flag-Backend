import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const admin: Admin = new Admin();
    admin.name = createAdminDto.name;
    admin.email = createAdminDto.email;
    admin.password = await bcrypt.hash(createAdminDto.password, 10);
    admin.country_code = createAdminDto.country_code;
    admin.contact_number = createAdminDto.contact_number;
    admin.role = createAdminDto.role;
    const result = await this.adminRepository.save(admin);
    return plainToClass(Admin, result);
  }

  async findAll(limit: number, offset: number, where: any) {
    const [list, count] = await this.adminRepository.findAndCount({
      where: where,
      select: {
        id: true,
        name: true,
        email: true,
        country_code: true,
        contact_number: true,
      },
      take: limit,
      skip: offset,
    });
    return [list, count];
  }

  async findOne(id: string) {
    const data = await this.adminRepository.findOne({
      where: { id: id, deleted_at: IsNull() },
      relations: {
        role: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        country_code: true,
        contact_number: true,
        role: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
    return data;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const record = await this.adminRepository.update(id, {
      ...updateAdminDto,
      updated_at: new Date().toISOString(),
    });
    return record;
  }

  async remove(id: string, deleteDto: DeleteDto) {
    const record = await this.adminRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at_ip: deleteDto.deleted_at_ip,
        deleted_at: new Date().toISOString(),
      },
    );
    return record;
  }
}
