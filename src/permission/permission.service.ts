import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const result = await this.permissionRepository.save(createPermissionDto);
    return plainToClass(Permission, result);
  }

  async findAll() {
    const result = await this.permissionRepository.find({
      where: {
        deleted_at: IsNull(),
      },
    });
    return plainToInstance(Permission, result);
  }

  async update(id: string, UpdatePermissionDto: UpdatePermissionDto) {
    const record = await this.permissionRepository.update(id, {
      ...UpdatePermissionDto,
      updated_at: new Date().toISOString(),
    });
    return record;
  }

  async remove(id: string, deleteDto: DeleteDto) {
    const record = await this.permissionRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at_ip: deleteDto.deleted_at_ip,
        deleted_at: new Date().toISOString(),
      },
    );
    return record;
  }
}
