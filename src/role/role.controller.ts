import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Next,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Response, NextFunction } from 'express';
import { CONSTANT } from '../shared/constants/message';
import response from '../shared/response';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    try {
      const permission = await this.roleService.create(createRoleDto);
      const data = {
        message: CONSTANT.SUCCESS.RECORD_CREATED('Role'),
        data: permission,
      };
      response.successCreate(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.roleService.update(id, updateRoleDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_UPDATED('Role')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Role'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() deleteDto: DeleteDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.roleService.remove(id, deleteDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_DELETED('Role')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Role'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
}
