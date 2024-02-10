import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Next,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CONSTANT } from '../shared/constants/message';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { IsNull, Repository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import response from '../shared/response';
import { DeleteDto } from 'src/shared/dto/delete.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto, @Res() res: Response) {
    // already email exist
    const already = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    if (already) {
      return response.badRequest(
        {
          message: CONSTANT.ERROR.ALREADY_EXISTS('Email'),
          data: { email: createAdminDto.email },
        },
        res,
      );
    }
    const result = await this.adminService.create(createAdminDto);
    return response.successResponse(
      {
        message: CONSTANT.SUCCESS.RECORD_CREATED('Admin'),
        data: result,
      },
      res,
    );
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const limit = req.query.limit ? req.query.limit : process.env.LIMIT;
      const offset = req.query.offset ? req.query.offset : process.env.OFFSET;
      const where = {
        deleted_at: IsNull(),
      };
      if (req.query.role) {
        Object.assign(where, { role: { id: req.query.role } });
      }
      const [list, count]: any = await this.adminService.findAll(
        +limit,
        +offset,
        where,
      );
      const data = {
        message: count
          ? CONSTANT.SUCCESS.RECORD_FOUND('Admin')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Admin'),
        total: count,
        limit: +limit,
        offset: +offset,
        data: list,
      };
      response.successResponseWithPagination(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.adminService.findOne(id);
      const data = {
        message: result
          ? CONSTANT.SUCCESS.RECORD_FOUND('Admin')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Admin'),
        data: result ? result : {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      if (updateAdminDto.password) {
        updateAdminDto.password = await bcrypt.hash(
          updateAdminDto.password,
          10,
        );
      }
      const result = await this.adminService.update(id, updateAdminDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_UPDATED('Admin')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Admin'),
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
      const result = await this.adminService.remove(id, deleteDto);
      const data = {
        message: result.affected
          ? CONSTANT.SUCCESS.RECORD_DELETED('Admin')
          : CONSTANT.SUCCESS.RECORD_NOT_FOUND('Admin'),
        data: {},
      };
      response.successResponse(data, res);
      next();
    } catch (error) {
      return response.failureResponse(error, res);
    }
  }
}
