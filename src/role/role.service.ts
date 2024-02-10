import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const result = await this.roleRepository.save(createRoleDto);
    return plainToClass(Role, result);
  }

  async findOne(id: string) {
    const data = await this.roleRepository
      .createQueryBuilder('r')
      .select([
        'r.id AS id',
        'r.name AS name',
        'r.description AS description',
        'r.is_admin AS is_admin',
        `(SELECT COUNT(id) FROM "admin" WHERE fk_role = "r"."id" AND deleted_at IS NULL)::numeric AS added_user_count`,
        `(
            SELECT jsonb_agg(
                jsonb_build_object('id', p.id, 'name', p.name)
            ) AS role_permissions
            FROM (
                SELECT "permission".id, "permission".name, "permission".type
                FROM unnest(r.role_permission) permission_id
                JOIN "permission" ON "permission".id = permission_id
            ) p
        ) AS role_permission`,
        `(
            SELECT jsonb_agg(
                jsonb_build_object('id', p.id, 'name', p.name)
            ) AS section_permissions
            FROM (
                SELECT "permission".id, "permission".name, "permission".type
                FROM unnest(r.section_permission) permission_id
                JOIN "permission" ON "permission".id = permission_id
            ) p
        ) AS section_permission`,
        'r.created_at AS created_at',
      ])
      .where(`r.id = '${id}' AND r.deleted_at IS NULL`)
      .getRawOne();
    return data;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const record = await this.roleRepository.update(id, {
      ...updateRoleDto,
      updated_at: new Date().toISOString(),
    });
    return record;
  }

  async remove(id: string, deleteDto: DeleteDto) {
    const record = await this.roleRepository.update(
      { id: id, deleted_at: IsNull() },
      {
        deleted_at_ip: deleteDto.deleted_at_ip,
        deleted_at: new Date().toISOString(),
      },
    );
    return record;
  }
}
