import {
  Controller,
  Get,
  Post,
  Body,
  Next,
  Res,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CONSTANT } from '../shared/constants/message';
import { Response, NextFunction } from 'express';
import response from '../shared/response';
import { DeleteDto } from 'src/shared/dto/delete.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    try {
      const permission =
        await this.permissionService.create(createPermissionDto);
      const data = {
        message: CONSTANT.SUCCESS.RECORD_CREATED('Permission'),
        data: permission,
      };
      response.successCreate(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const permission = await this.permissionService.findAll();
      const data = {
        message: CONSTANT.SUCCESS.RECORD_FOUND('Permissions'),
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
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.permissionService.update(
        id,
        updatePermissionDto,
      );
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_UPDATED('Permission')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Permission'),
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
      const result = await this.permissionService.remove(id, deleteDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_DELETED('Permission')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Permission'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
}
